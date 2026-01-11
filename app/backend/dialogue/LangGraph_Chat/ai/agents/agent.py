import uuid
import json
import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from langchain_core.messages import merge_message_runs

from langchain_openai import ChatOpenAI

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.store.base import BaseStore
from langgraph.store.memory import InMemoryStore

from ai.llm_models import DEFAULT_CHAT_MODEL, DEFAULT_EXTRACTOR_MODEL, resolve_model_name
from ai.tools.trustapi_tools import create_trustcall_memory_extractor, trustcall_extract
from ai.tools.sentiment_tools import LLMEmotionDetector, RESPONSE_STRATEGIES
from configuration import Configuration
from schema.schema import EmotionAnalysis, ExtractedMemory, ExtractedMemories, ChatState


load_dotenv()

logger = logging.getLogger(__name__)

# ============================================================================
# CONFIGURATION
# ============================================================================

_default_cfg = Configuration.from_runnable_config()
_resolved_chat_model_name = resolve_model_name(
    getattr(_default_cfg, "model_name", None),
    default=DEFAULT_CHAT_MODEL,
)
_resolved_extractor_model_name = resolve_model_name(
    getattr(_default_cfg, "extractor_model_name", None),
    default=DEFAULT_EXTRACTOR_MODEL,
)

model = ChatOpenAI(
    model=_resolved_chat_model_name,
    temperature=float(getattr(_default_cfg, "temperature", 0.7)),
)
extractor_model = ChatOpenAI(
    model=_resolved_extractor_model_name,
    temperature=float(getattr(_default_cfg, "extractor_temperature", 0.0)),
)


_PROMPTS_DIR = Path(__file__).resolve().parents[2] / "prompts"


def _load_prompt(filename: str) -> str:
    return (_PROMPTS_DIR / filename).read_text(encoding="utf-8").strip()

# Global store and checkpointer (currently only short term memory uses store)
checkpointer = MemorySaver()
in_memory_store = InMemoryStore()


try:
    _EMOTION_SYSTEM_PROMPT = _load_prompt("emotion_system.txt")
except Exception:
    logger.exception("Failed to load emotion prompt template")
    raise


emotion_detector = LLMEmotionDetector(
    model_name=_resolved_extractor_model_name,
    system_prompt=_EMOTION_SYSTEM_PROMPT,
)


# ============================================================================
# SHORT-TERM MEMORY (LangGraph InMemoryStore)
# ============================================================================

def _safe_thread_id(thread_id: Optional[str]) -> str:
    tid = (thread_id or "").strip()
    print("tid: ",tid)
    return tid if tid else "default-thread"


def _user_memory_ns(user_id: str) -> tuple:
    return ("user_memory", user_id)


def _thread_memory_ns(user_id: str, thread_id: Optional[str]) -> tuple:
    return ("thread_memory", user_id, _safe_thread_id(thread_id))


def _thread_id_from_config(config: RunnableConfig) -> Optional[str]:
    try:
        configurable = config.get("configurable", {}) if isinstance(config, dict) else {}
        return configurable.get("thread_id")
    except Exception:
        return None

async def store_to_memory(store: BaseStore, namespace: tuple, key: str, value: Any):
    """Store data in LangGraph's InMemoryStore."""
    await store.aput(namespace, key, {"value": value, "timestamp": datetime.now().isoformat()})


async def get_from_memory(store: BaseStore, namespace: tuple, key: str) -> Any:
    """Retrieve data from LangGraph's InMemoryStore."""
    try:
        item = await store.aget(namespace, key)
        return item.value.get("value") if item else None
    except Exception:
        logger.exception("get_from_memory failed")
        return None


async def _collect_search_results(store: BaseStore, namespace: tuple) -> List[Any]:
    res = store.asearch(namespace)
    if hasattr(res, "__aiter__"):
        items: List[Any] = []
        async for item in res:  # type: ignore[assignment]
            items.append(item)
        return items
    return await res  # type: ignore[return-value]


async def get_session_context(store: BaseStore, namespace: tuple) -> List[Dict]:
    """Get all stored items for a namespace from InMemoryStore."""
    try:
        items = await _collect_search_results(store, namespace)
        return [{"key": item.key, **item.value} for item in items]
    except Exception:
        logger.exception("get_session_context failed")
        return []


_trustcall_memory_extractor = create_trustcall_memory_extractor(
    extractor_model,
    tool_model=ExtractedMemory,
    tool_choice="ExtractedMemory",
    enable_inserts=True,
)


try:
    TRUSTCALL_MEMORY_INSTRUCTION = _load_prompt("memory_trustcall_instruction.txt")
    _FALLBACK_MEMORY_EXTRACTION_PROMPT = _load_prompt("memory_fallback_extraction_prompt.txt")
    _RESPONSE_SYSTEM_TEMPLATE = _load_prompt("response_system_template.txt")
except Exception:
    logger.exception("Failed to load prompt templates")
    raise


def _normalize_memory_text(text: str) -> str:
    return " ".join((text or "").strip().lower().split())


def _dedupe_memories(new_items: List[ExtractedMemory], existing_texts: List[str]) -> List[ExtractedMemory]:
    existing_norm = {_normalize_memory_text(t) for t in existing_texts if t}
    out: List[ExtractedMemory] = []
    for item in new_items:
        norm = _normalize_memory_text(item.content)
        if not norm or norm in existing_norm:
            continue
        existing_norm.add(norm)
        out.append(item)
    return out


async def _fallback_extract_memories(messages: List[BaseMessage]) -> List[ExtractedMemory]:
    try:
        resp = await extractor_model.ainvoke(
            [SystemMessage(content=_FALLBACK_MEMORY_EXTRACTION_PROMPT)] + list(messages)
        )
        content = (resp.content or "").strip()
        if "```json" in content:
            content = content.split("```json", 1)[1].split("```", 1)[0]
        elif "```" in content:
            content = content.split("```", 1)[1].split("```", 1)[0]
        data = json.loads(content.strip() or "{}")
        parsed = ExtractedMemories.model_validate(data)
        return [m for m in parsed.memories if (m.content or "").strip()]
    except Exception:
        logger.exception("Fallback memory extraction failed")
        return []


async def extract_and_store_memory(
    store: BaseStore,
    user_id: str,
    message: str,
    *,
    thread_id: Optional[str],
    messages: Optional[List[BaseMessage]] = None,
):
    """Extract info from message and store in short-term (InMemoryStore)."""

    if not user_id:
        user_id = "default-user"

    if messages is None:
        messages = [HumanMessage(content=message)]

    # Collect existing memory texts for dedupe (global preferences + this thread's memories).
    existing_texts_user: List[str] = []
    existing_texts_thread: List[str] = []
    try:
        user_data = await get_session_context(store, _user_memory_ns(user_id))
        for item in user_data[-50:]:
            value = item.get("value")
            if isinstance(value, dict) and value.get("content"):
                existing_texts_user.append(str(value.get("content")))
    except Exception:
        logger.exception("Failed to read existing user memories")

    try:
        thread_data = await get_session_context(store, _thread_memory_ns(user_id, thread_id))
        for item in thread_data[-50:]:
            value = item.get("value")
            if isinstance(value, dict) and value.get("content"):
                existing_texts_thread.append(str(value.get("content")))
    except Exception:
        logger.exception("Failed to read existing thread memories")

    if _trustcall_memory_extractor is not None and messages:
        # Provide some existing context so the extractor can update/dedupe.
        tool_name = "ExtractedMemory"

        existing: List[tuple] = []


        # Existing memories (user + current thread) as docs.
        try:
            for ns in (_user_memory_ns(user_id), _thread_memory_ns(user_id, thread_id)):
                session_data = await get_session_context(store, ns)
                for item in session_data[-25:]:
                    key = item.get("key")
                    value = item.get("value")
                    if not key or not isinstance(value, dict):
                        continue
                    content = value.get("content")
                    if not content:
                        continue
                    existing.append(
                        (
                            str(key),
                            tool_name,
                            {
                                "memory_type": value.get("type", "other"),
                                "content": content,
                                "importance": float(value.get("importance", 0.5) or 0.5),
                            },
                        )
                    )
        except Exception:
            logger.exception("Failed to build TrustCall existing memory set")

        updated_messages = list(
            merge_message_runs(messages=[SystemMessage(content=TRUSTCALL_MEMORY_INSTRUCTION)] + messages)
        )

        try:
            result = await trustcall_extract(
                _trustcall_memory_extractor,
                {
                    "messages": updated_messages,
                    "existing": existing if existing else None,
                },
            )

            # Build a lookup of existing keys by normalized content for reuse
            existing_key_by_content: Dict[str, str] = {}
            for (key, _, data) in existing:
                norm = _normalize_memory_text(data.get("content", ""))
                if norm:
                    existing_key_by_content[norm] = key

            user_types = {"preference", "fact"}

            for r in result.get("responses", []):
                try:
                    extracted = r.model_dump(mode="json")
                    item = ExtractedMemory.model_validate(extracted)
                    content_norm = _normalize_memory_text(item.content)

                    if not content_norm:
                        continue

                    # Reuse existing key if content matches (update), else create new
                    doc_id = existing_key_by_content.get(content_norm) or f"mem_{uuid.uuid4().hex[:12]}"

                    namespace = (
                        _user_memory_ns(user_id)
                        if item.memory_type in user_types
                        else _thread_memory_ns(user_id, thread_id)
                    )

                    await store_to_memory(
                        store,
                        namespace,
                        str(doc_id),
                        {
                            "content": item.content.strip(),
                            "type": item.memory_type,
                            "importance": float(item.importance or 0.5),
                            "source": "trustcall",
                        },
                    )

                    # Track this content so we don't store duplicates within this batch
                    existing_key_by_content[content_norm] = doc_id
                except Exception:
                    continue

            return
        except Exception:
            logger.exception("TrustCall memory extraction failed")

    extracted_items = await _fallback_extract_memories(messages)

    user_types = {"preference", "fact"}
    user_items = [m for m in extracted_items if m.memory_type in user_types]
    thread_items = [m for m in extracted_items if m.memory_type not in user_types]
    user_items = _dedupe_memories(user_items, existing_texts_user)
    thread_items = _dedupe_memories(thread_items, existing_texts_thread)

    for item in user_items + thread_items:
        doc_id = f"mem_{uuid.uuid4().hex[:12]}"
        namespace = (
            _user_memory_ns(user_id)
            if item.memory_type in user_types
            else _thread_memory_ns(user_id, thread_id)
        )
        await store_to_memory(
            store,
            namespace,
            str(doc_id),
            {
                "content": item.content.strip(),
                "type": item.memory_type,
                "importance": float(item.importance or 0.5),
                "source": "fallback",
            },
        )

    return


async def get_memory_context(store: BaseStore, user_id: str, thread_id: Optional[str]) -> str:
    """Get memory context: global preferences + current-thread facts/events."""
    memory_lines: List[str] = []

    logger.info(f"[MEMORY] Retrieving memory for user_id={user_id}, thread_id={thread_id}")

    # Global (user) memory: focus on preferences.
    try:
        user_data = await get_session_context(store, _user_memory_ns(user_id))
        logger.info(f"[MEMORY] User memory items found: {len(user_data)}")
        for item in user_data[-5:]:
            value = item.get("value", {})
            if isinstance(value, dict) and value.get("content"):
                memory_lines.append(f"- [user/{value.get('type', 'info')}] {value['content']}")
    except Exception:
        logger.exception("get_memory_context user namespace failed")

    # Thread-scoped memory: meeting-specific facts/events/etc.
    try:
        thread_data = await get_session_context(store, _thread_memory_ns(user_id, thread_id))
        logger.info(f"[MEMORY] Thread memory items found: {len(thread_data)}")
        for item in thread_data[-8:]:
            value = item.get("value", {})
            if isinstance(value, dict) and value.get("content"):
                memory_lines.append(f"- [thread/{value.get('type', 'info')}] {value['content']}")
    except Exception:
        logger.exception("get_memory_context thread namespace failed")

    if not memory_lines:
        logger.info("[MEMORY] No memories found to inject into prompt")
        return ""

    memory_context = "\nWhat I remember:\n" + "\n".join(memory_lines)
    logger.info(f"[MEMORY] Memory context: {memory_context}")
    return memory_context


# ============================================================================
# CHAT STATE (Uses MessagesState for automatic message handling)
# ============================================================================

# ============================================================================
# GRAPH NODES (Use store parameter for InMemoryStore access)
# ============================================================================

def get_conversation_context_from_messages(messages: List[BaseMessage], last_n: int = 5) -> str:
    """Get recent conversation as context string from messages."""
    recent = messages[-last_n:] if messages else []
    context_parts = []
    for msg in recent:
        role = "User" if isinstance(msg, HumanMessage) else "AI"
        context_parts.append(f"{role}: {msg.content}")
    return "\n".join(context_parts)


async def analyze_emotion_node(state: ChatState, config: RunnableConfig, *, store: BaseStore) -> Dict:
    """Analyze user's emotional state using LLM."""
    messages = state.get("messages", [])
    
    if messages and isinstance(messages[-1], HumanMessage):
        user_message = messages[-1].content
        context = get_conversation_context_from_messages(messages)
        
        # Use LLM-based emotion detection
        analysis = await emotion_detector.analyze(user_message, context)
        
        return {
            "emotion_score": analysis.score,
            "emotion_label": analysis.label,
            "emotion_reasoning": analysis.reasoning,
            "response_tone": analysis.suggested_response_tone
        }
    
    return {}


async def process_memory_node(state: ChatState, config: RunnableConfig, *, store: BaseStore) -> Dict:
    """Process and update memory using LangGraph store."""
    messages = state.get("messages", [])
    user_id = state.get("user_id", "default-user")

    last_user_message: Optional[str] = None
    for msg in reversed(messages or []):
        if isinstance(msg, HumanMessage):
            last_user_message = msg.content
            break

    if last_user_message:
        thread_id = _thread_id_from_config(config)
        await extract_and_store_memory(store, user_id, last_user_message, thread_id=thread_id, messages=messages)
        memory_context = await get_memory_context(store, user_id, thread_id)
        return {"memory_context": memory_context}
    
    return {}


async def generate_response_node(state: ChatState, config: RunnableConfig, *, store: BaseStore) -> Dict:
    """Generate AI response with emotional awareness."""
    messages = state.get("messages", [])
    user_id = state.get("user_id", "default-user")
    emotion_score = state.get("emotion_score", 3)
    emotion_label = state.get("emotion_label", "neutral")
    response_tone = state.get("response_tone", "friendly")

    thread_id = _thread_id_from_config(config)
    memory_context = await get_memory_context(store, user_id, thread_id)
    
    strategy = RESPONSE_STRATEGIES.get(emotion_score, RESPONSE_STRATEGIES[3])
    
    system_prompt = _RESPONSE_SYSTEM_TEMPLATE.format(
        emotion_score=emotion_score,
        emotion_label=emotion_label,
        response_tone=response_tone,
        priority=strategy["priority"],
        style=strategy["style"],
        memory_context=memory_context,
        guideline_1=(
            "Prioritize de-escalation. Apologize and validate their feelings first."
            if emotion_score <= 2
            else "Maintain appropriate emotional matching."
        ),
        guideline_4=(
            "Keep response focused on solving their problem"
            if emotion_score <= 2
            else "Feel free to be more conversational"
        ),
    )

    model_messages = [SystemMessage(content=system_prompt)] + messages
    
    response = await model.ainvoke(model_messages)
    
    # Return only the new message to be added (MessagesState handles appending)
    return {"messages": [response]}


# ============================================================================
# BUILD GRAPH
# ============================================================================

def build_chat_graph():
    """Build the LangGraph chat workflow.

    For production, inject a process-safe store/checkpointer (e.g., Postgres/Redis-backed)
    rather than relying on in-process memory.
    """
    store = in_memory_store
    cp = checkpointer

    workflow = StateGraph(ChatState)
    
    workflow.add_node("analyze_emotion", analyze_emotion_node)
    workflow.add_node("process_memory", process_memory_node)
    workflow.add_node("generate_response", generate_response_node)

    workflow.add_edge(START, "analyze_emotion")
    workflow.add_edge("analyze_emotion", "generate_response")
    workflow.add_edge("generate_response", "process_memory")
    workflow.add_edge("process_memory", END)
    
    return workflow.compile(checkpointer=cp, store=store)


# ============================================================================
# CHAT ENGINE
# ============================================================================

class ChatEngine:
    """Main chat interface for MVP."""
    
    def __init__(
        self,
        user_id: str = "default-user",
        thread_id: Optional[str] = None,
        *,
        store: Optional[BaseStore] = None,
        checkpointer: Optional[MemorySaver] = None,
    ):
        self.user_id = user_id
        self._store = store or in_memory_store
        self._checkpointer = checkpointer or checkpointer
        self.graph = self._build_graph()
        self.thread_id = thread_id or str(uuid.uuid4())

    def _build_graph(self):
        workflow = StateGraph(ChatState)
        workflow.add_node("analyze_emotion", analyze_emotion_node)
        workflow.add_node("process_memory", process_memory_node)
        workflow.add_node("generate_response", generate_response_node)

        workflow.add_edge(START, "analyze_emotion")
        workflow.add_edge("analyze_emotion", "generate_response")
        workflow.add_edge("generate_response", "process_memory")
        workflow.add_edge("process_memory", END)

        return workflow.compile(checkpointer=self._checkpointer, store=self._store)
    
    async def achat(self, message: str) -> Dict[str, Any]:
        """Async chat API."""
        input_state = {
            "messages": [HumanMessage(content=message)],
            "user_id": self.user_id,
        }

        config = {"configurable": {"thread_id": self.thread_id}}
        result = await self.graph.ainvoke(input_state, config)

        response_text = ""
        if result.get("messages"):
            last = result["messages"][-1]
            if isinstance(last, AIMessage):
                response_text = last.content

        return {
            "response": response_text,
            "emotion": {
                "score": result.get("emotion_score", 3),
                "label": result.get("emotion_label", "neutral"),
                "reasoning": result.get("emotion_reasoning", ""),
            },
        }

    def chat(self, message: str) -> Dict[str, Any]:
        """Sync wrapper around async chat.

        Note: If you're already in an async context (e.g. FastAPI), call `await achat(...)`.
        """
        try:
            asyncio.get_running_loop()
        except RuntimeError:
            return asyncio.run(self.achat(message))

        raise RuntimeError(
            'ChatEngine.chat() was called from an async context. '
            'Use: await ChatEngine.achat(...)'
        )
    
    def reset(self):
        """Reset conversation - start new thread (checkpointer handles the rest)."""
        self.thread_id = str(uuid.uuid4())
