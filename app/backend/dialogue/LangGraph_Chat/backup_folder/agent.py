import uuid
import json
import asyncio
from datetime import datetime
from typing import Literal, Optional, List, Dict, Any, TypedDict

from pydantic import BaseModel, Field
from dotenv import load_dotenv

from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from langchain_core.messages import merge_message_runs

from langchain_openai import ChatOpenAI

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.store.base import BaseStore
from langgraph.store.memory import InMemoryStore

import asyncpg
import os

import configuration

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

try:
    from trustcall import create_extractor  # type: ignore
    _TRUSTCALL_AVAILABLE = True
except Exception:
    create_extractor = None
    _TRUSTCALL_AVAILABLE = False

# PostgreSQL connection for Railway (long-term persistent memory)
DATABASE_URL = os.getenv("DATABASE_URL")

# LangGraph memory systems:
# 1. Checkpointer (MemorySaver) - Handles conversation history per thread automatically
# 2. InMemoryStore - Session-scoped data (extracted facts, preferences) accessible across nodes
checkpointer = MemorySaver()
in_memory_store = InMemoryStore()

# ============================================================================
# EMOTION DETECTION (LLM-Based, 5-Stage Scale)
# ============================================================================

EMOTION_SCALE = {
    1: {"label": "very_frustrated", "description": "Extremely upset, angry, or distressed"},
    2: {"label": "frustrated", "description": "Annoyed, bothered, or mildly upset"},
    3: {"label": "neutral", "description": "No strong emotion, matter-of-fact"},
    4: {"label": "satisfied", "description": "Positive, pleased, or content"},
    5: {"label": "very_satisfied", "description": "Extremely happy, excited, or delighted"}
}

RESPONSE_STRATEGIES = {
    1: {
        "tone": "extremely empathetic and solution-focused",
        "priority": "de-escalation and acknowledgment",
        "style": "Apologize sincerely, validate feelings, offer immediate help"
    },
    2: {
        "tone": "understanding and patient",
        "priority": "acknowledge frustration and provide support",
        "style": "Show empathy, address concerns directly, remain calm"
    },
    3: {
        "tone": "friendly and helpful",
        "priority": "provide accurate information",
        "style": "Professional, conversational, balanced"
    },
    4: {
        "tone": "warm and encouraging",
        "priority": "maintain positive momentum",
        "style": "Match their positive energy, be supportive"
    },
    5: {
        "tone": "enthusiastic and celebratory",
        "priority": "share in their joy",
        "style": "Be excited, congratulatory, amplify positivity"
    }
}


class EmotionAnalysis(BaseModel):
    """Structured emotion analysis result."""
    score: int = Field(ge=1, le=5, description="1=very frustrated to 5=very satisfied")
    label: str
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    suggested_response_tone: str


class LLMEmotionDetector:
    """
    LLM-powered emotion detector using 5-stage satisfaction scale.
    This replaces the keyword-based approach with actual AI understanding.
    """
    
    def __init__(self, model_name: str = "gpt-4o-mini"):
        self.llm = ChatOpenAI(model=model_name, temperature=0.1)
        
        self.system_prompt = """You are an expert emotion analyst. Analyze user messages and determine their emotional state on a 5-point satisfaction scale:

SCALE:
1 - VERY FRUSTRATED: Extremely upset, angry, distressed. Harsh language, strong complaints, expressions of extreme dissatisfaction, threats to leave, ALL CAPS anger.
2 - FRUSTRATED: Annoyed, bothered, mildly upset. Signs of impatience, mild complaints, dissatisfaction but controlled.
3 - NEUTRAL: No strong emotion. Matter-of-fact, informational, calm. Simple questions or statements.
4 - SATISFIED: Positive, pleased, content. Shows appreciation, thanks, mild happiness, things going well.
5 - VERY SATISFIED: Extremely happy, excited, delighted. Enthusiastic praise, multiple exclamation marks for joy, expressing love/gratitude.

DETECTION TIPS:
- "This is bullshit" / "WTF" / "I'm done" → Score 1
- "This is frustrating" / "I've been waiting" / "Not great" → Score 2
- "I have a question" / "Can you help" / "Okay" → Score 3
- "Thanks!" / "That worked" / "Nice" → Score 4
- "OMG thank you so much!!!" / "You're amazing!" / "Best ever!" → Score 5

Watch for sarcasm (often indicates frustration despite positive words).
Consider context, punctuation intensity, and word choice.

Respond with JSON only:
{"score": <1-5>, "label": "<label>", "confidence": <0-1>, "reasoning": "<brief>", "suggested_response_tone": "<tone>"}"""

    async def analyze(self, message: str, context: str = "") -> EmotionAnalysis:
        """Analyze emotion using LLM."""
        
        context_text = f"\nRecent context: {context}" if context else ""
        
        user_prompt = f"""Analyze this message:{context_text}

MESSAGE: "{message}"

Return JSON only."""

        try:
            response = await self.llm.ainvoke([
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=user_prompt)
            ])
            
            content = response.content.strip()
            
            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content.strip())
            score = max(1, min(5, int(data.get("score", 3))))
            
            return EmotionAnalysis(
                score=score,
                label=data.get("label", EMOTION_SCALE[score]["label"]),
                confidence=float(data.get("confidence", 0.8)),
                reasoning=data.get("reasoning", ""),
                suggested_response_tone=data.get("suggested_response_tone", RESPONSE_STRATEGIES[score]["tone"])
            )
            
        except Exception as e:
            return EmotionAnalysis(
                score=3,
                label="neutral",
                confidence=0.5,
                reasoning=f"Analysis error: {e}",
                suggested_response_tone=RESPONSE_STRATEGIES[3]["tone"]
            )
    
    def analyze_sync(self, message: str, context: str = "") -> EmotionAnalysis:
        """Synchronous wrapper for emotion analysis."""
        return asyncio.run(self.analyze(message, context))


# Global detector instance
emotion_detector = LLMEmotionDetector()


# ============================================================================
# POSTGRESQL MEMORY SYSTEM (Railway)
# ============================================================================
'''
class PostgresMemoryStore:
    """
    Long-term memory storage using PostgreSQL on Railway.
    Integrates with existing Prisma schema (Memory model).
    """
    
    def __init__(self, database_url: str = None):
        self.database_url = database_url or DATABASE_URL
        self._pool = None
    
    async def get_pool(self):
        """Get or create connection pool."""
        if self._pool is None:
            self._pool = await asyncpg.create_pool(self.database_url, min_size=1, max_size=5)
        return self._pool
    
    async def store_memory(
        self,
        user_id: str,
        content: str,
        memory_type: str = "fact",
        importance: float = 0.5,
        metadata: dict = None
    ) -> str:
        """Store a memory in PostgreSQL."""
        pool = await self.get_pool()
        
        memory_id = f"mem_{uuid.uuid4().hex[:12]}"
        
        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO "Memory" (id, "userId", content, "memoryType", importance, metadata, "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
            """, memory_id, user_id, content, memory_type, importance, json.dumps(metadata or {}))
        
        return memory_id

    async def upsert_memory(
        self,
        memory_id: str,
        user_id: str,
        content: str,
        memory_type: str = "fact",
        importance: float = 0.5,
        metadata: dict = None,
    ) -> str:
        """Insert or update a memory by ID (useful for schema-based extractors)."""
        pool = await self.get_pool()

        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO "Memory" (id, "userId", content, "memoryType", importance, metadata, "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                ON CONFLICT (id) DO UPDATE
                SET content = EXCLUDED.content,
                    "memoryType" = EXCLUDED."memoryType",
                    importance = EXCLUDED.importance,
                    metadata = EXCLUDED.metadata
                """,
                memory_id,
                user_id,
                content,
                memory_type,
                importance,
                json.dumps(metadata or {}),
            )

        return memory_id
    
    async def get_memories(
        self,
        user_id: str,
        memory_type: str = None,
        limit: int = 20
    ) -> List[Dict]:
        """Retrieve memories for a user."""
        pool = await self.get_pool()
        
        async with pool.acquire() as conn:
            if memory_type:
                rows = await conn.fetch("""
                    SELECT id, content, "memoryType", importance, metadata, "createdAt"
                    FROM "Memory"
                    WHERE "userId" = $1 AND "memoryType" = $2
                    ORDER BY "createdAt" DESC
                    LIMIT $3
                """, user_id, memory_type, limit)
            else:
                rows = await conn.fetch("""
                    SELECT id, content, "memoryType", importance, metadata, "createdAt"
                    FROM "Memory"
                    WHERE "userId" = $1
                    ORDER BY importance DESC, "createdAt" DESC
                    LIMIT $2
                """, user_id, limit)
        
        return [dict(row) for row in rows]
    
    async def search_memories(self, user_id: str, query: str, limit: int = 5) -> List[Dict]:
        """Search memories by content (simple text search)."""
        pool = await self.get_pool()
        
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, content, "memoryType", importance, metadata, "createdAt"
                FROM "Memory"
                WHERE "userId" = $1 AND content ILIKE $2
                ORDER BY importance DESC
                LIMIT $3
            """, user_id, f"%{query}%", limit)
        
        return [dict(row) for row in rows]
    
    async def close(self):
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
'''

# ============================================================================
# SHORT-TERM MEMORY (LangGraph InMemoryStore)
# ============================================================================

def store_to_memory(store: BaseStore, user_id: str, key: str, value: Any):
    """Store data in LangGraph's InMemoryStore."""
    namespace = ("session", user_id)
    store.put(namespace, key, {"value": value, "timestamp": datetime.now().isoformat()})


def get_from_memory(store: BaseStore, user_id: str, key: str) -> Any:
    """Retrieve data from LangGraph's InMemoryStore."""
    namespace = ("session", user_id)
    try:
        item = store.get(namespace, key)
        return item.value.get("value") if item else None
    except Exception:
        return None


def get_session_context(store: BaseStore, user_id: str) -> List[Dict]:
    """Get all session data for a user from InMemoryStore."""
    namespace = ("session", user_id)
    try:
        items = list(store.search(namespace))
        return [{"key": item.key, **item.value} for item in items]
    except Exception:
        return []


class ExtractedMemory(BaseModel):
    """Single extracted memory item (schema-first extraction)."""

    memory_type: Literal["preference", "fact", "event", "relationship", "other"] = Field(
        description="The category of the memory."
    )
    content: str = Field(
        description="A concise, standalone memory about the user. Do not include tool instructions."
    )
    importance: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="How important/lasting this memory is (0-1).",
    )


_trustcall_memory_extractor = (
    create_extractor(
        model,
        tools=[ExtractedMemory],
        tool_choice="ExtractedMemory",
        enable_inserts=True,
    )
    if _TRUSTCALL_AVAILABLE
    else None
)


TRUSTCALL_MEMORY_INSTRUCTION = """Reflect on the following interaction.

Use the provided tool to save durable, user-specific memories that would be helpful later.

Rules:
- Only store stable facts/preferences/relationships/recurring goals.
- Avoid transient details (one-off chit-chat, temporary states, single-session tasks).
- If an existing memory already captures the same idea, update it instead of inserting a duplicate.
- Keep `content` short and standalone.
"""


async def extract_and_store_memory(
    store: BaseStore,
    postgres_store: PostgresMemoryStore,
    user_id: str,
    message: str,
    messages: Optional[List[BaseMessage]] = None,
):
    """Extract info from message and store in both short-term (InMemoryStore) and long-term (PostgreSQL)."""

    if _trustcall_memory_extractor is not None and messages:
        # Provide some existing context so the extractor can update/dedupe.
        tool_name = "ExtractedMemory"

        existing: List[tuple] = []

        # Long-term (PostgreSQL) memories as existing docs
        try:
            long_term = await postgres_store.get_memories(user_id, limit=25)
            for m in long_term:
                mem_id = m.get("id")
                if not mem_id:
                    continue
                existing.append(
                    (
                        mem_id,
                        tool_name,
                        {
                            "memory_type": m.get("memoryType", "other"),
                            "content": m.get("content", ""),
                            "importance": float(m.get("importance", 0.5) or 0.5),
                        },
                    )
                )
        except Exception:
            pass

        # Session (InMemoryStore) memories as existing docs
        try:
            session_data = get_session_context(store, user_id)
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
            pass

        updated_messages = list(
            merge_message_runs(messages=[SystemMessage(content=TRUSTCALL_MEMORY_INSTRUCTION)] + messages)
        )

        try:
            result = _trustcall_memory_extractor.invoke(
                {
                    "messages": updated_messages,
                    "existing": existing if existing else None,
                }
            )

            for r, rmeta in zip(result.get("responses", []), result.get("response_metadata", [])):
                extracted = r.model_dump(mode="json")
                content = (extracted.get("content") or "").strip()
                memory_type = extracted.get("memory_type") or "other"
                importance = float(extracted.get("importance", 0.5) or 0.5)
                if not content:
                    continue

                doc_id = rmeta.get("json_doc_id") or f"mem_{uuid.uuid4().hex[:12]}"

                # Short-term store
                store_to_memory(
                    store,
                    user_id,
                    str(doc_id),
                    {
                        "content": content,
                        "type": memory_type,
                        "importance": importance,
                        "source": "trustcall",
                    },
                )

                # Long-term store (upsert to avoid duplicates)
                try:
                    await postgres_store.upsert_memory(
                        memory_id=str(doc_id),
                        user_id=user_id,
                        content=content,
                        memory_type=str(memory_type),
                        importance=importance,
                        metadata={"source": "trustcall", "extracted_at": datetime.now().isoformat()},
                    )
                except Exception as e:
                    print(f"PostgreSQL store error: {e}")

            return
        except Exception:
            return

    # If TrustCall isn't available (or we don't have message context), skip memory extraction.
    return


async def get_memory_context(store: BaseStore, postgres_store: PostgresMemoryStore, user_id: str) -> str:
    """Get combined memory context from both short-term and long-term stores."""
    memory_lines = []
    
    # Get session data from InMemoryStore
    session_data = get_session_context(store, user_id)
    for item in session_data[-5:]:  # Last 5 session items
        value = item.get("value", {})
        if isinstance(value, dict) and "content" in value:
            memory_lines.append(f"- [session/{value.get('type', 'info')}] {value['content']}")
    
    # Get long-term memories from PostgreSQL
    # try:
    #    long_term = await postgres_store.get_memories(user_id, limit=10)
    #    for m in long_term:
    #        mem_type = m.get("memoryType", "fact")
    #        content = m.get("content", "")
    #        memory_lines.append(f"- [long-term/{mem_type}] {content}")
    #except Exception as e:
    #    print(f"PostgreSQL retrieval error: {e}")
    
    if not memory_lines:
        return ""
    
    return "\nWhat I remember about this user:\n" + "\n".join(memory_lines)


# Global PostgreSQL store instance
postgres_store = PostgresMemoryStore()


# ============================================================================
# CHAT STATE (Uses MessagesState for automatic message handling)
# ============================================================================

class ChatState(MessagesState):
    """State for the chat graph. Extends MessagesState for automatic message handling."""
    user_id: str
    emotion_score: int  # 1-5 scale
    emotion_label: str
    emotion_reasoning: str
    response_tone: str
    memory_context: str


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
    
    if messages and isinstance(messages[-1], HumanMessage):
        user_message = messages[-1].content
        
        # Extract and store in both InMemoryStore and PostgreSQL
        await extract_and_store_memory(store, postgres_store, user_id, user_message, messages=messages)
        
        # Get combined memory context
        memory_context = await get_memory_context(store, postgres_store, user_id)
        
        return {"memory_context": memory_context}
    
    return {}


def generate_response_node(state: ChatState, config: RunnableConfig, *, store: BaseStore) -> Dict:
    """Generate AI response with emotional awareness."""
    messages = state.get("messages", [])
    emotion_score = state.get("emotion_score", 3)
    emotion_label = state.get("emotion_label", "neutral")
    response_tone = state.get("response_tone", "friendly")
    memory_context = state.get("memory_context", "")
    
    # Get response strategy
    strategy = RESPONSE_STRATEGIES.get(emotion_score, RESPONSE_STRATEGIES[3])
    
    system_prompt = f"""You are an emotionally intelligent AI companion.

CURRENT USER EMOTIONAL STATE:
- Score: {emotion_score}/5 ({emotion_label})
- Your response should be: {response_tone}
- Priority: {strategy["priority"]}
- Style: {strategy["style"]}

{memory_context}

RESPONSE GUIDELINES:
1. {"Prioritize de-escalation. Apologize and validate their feelings first." if emotion_score <= 2 else "Maintain appropriate emotional matching."}
2. Be genuine and human-like in your responses
3. Reference past conversations when relevant
4. {"Keep response focused on solving their problem" if emotion_score <= 2 else "Feel free to be more conversational"}
5. Never be dismissive of their emotions"""

    model_messages = [SystemMessage(content=system_prompt)] + messages
    
    response = model.invoke(model_messages)
    
    # Return only the new message to be added (MessagesState handles appending)
    return {"messages": [response]}


# ============================================================================
# BUILD GRAPH
# ============================================================================

def build_chat_graph():
    """Build the LangGraph chat workflow with store and checkpointer."""
    workflow = StateGraph(ChatState)
    
    workflow.add_node("analyze_emotion", analyze_emotion_node)
    workflow.add_node("process_memory", process_memory_node)
    workflow.add_node("generate_response", generate_response_node)
    
    workflow.add_edge(START, "analyze_emotion")
    workflow.add_edge("analyze_emotion", "generate_response")
    workflow.add_edge("START", "process_memory")
    workflow.add_edge("process_memory", "generate_response")
    workflow.add_edge("generate_response", END)
    
    # Compile with both checkpointer (for message history) and store (for session data)
    return workflow.compile(checkpointer=checkpointer, store=in_memory_store)


# ============================================================================
# CHAT ENGINE
# ============================================================================

class ChatEngine:
    """Main chat interface for MVP."""
    
    def __init__(self, user_id: str = "default-user"):
        self.user_id = user_id
        self.graph = build_chat_graph()
        self.thread_id = str(uuid.uuid4())
    
    def chat(self, message: str) -> Dict[str, Any]:
        """Send a message and get response with emotion analysis."""
        input_state = {
            "messages": [HumanMessage(content=message)],
            "user_id": self.user_id,
            "emotion_score": 3,
            "emotion_label": "neutral",
            "emotion_reasoning": "",
            "response_tone": "friendly",
            "memory_context": ""
        }
        
        config = {"configurable": {"thread_id": self.thread_id}}
        result = self.graph.invoke(input_state, config)
        
        response_text = ""
        if result["messages"]:
            last = result["messages"][-1]
            if isinstance(last, AIMessage):
                response_text = last.content
        
        return {
            "response": response_text,
            "emotion": {
                "score": result.get("emotion_score", 3),
                "label": result.get("emotion_label", "neutral"),
                "reasoning": result.get("emotion_reasoning", "")
            }
        }
    
    def reset(self):
        """Reset conversation - start new thread (checkpointer handles the rest)."""
        self.thread_id = str(uuid.uuid4())


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Chat MVP - Phase 1")
    print("Emotion Scale: 1 (Very Frustrated) → 5 (Very Satisfied)")
    print("Memory Architecture:")
    print("  • Short-term: LangGraph MemorySaver (checkpointer) + InMemoryStore")
    print("  • Long-term: PostgreSQL (Railway)")
    print("=" * 60)
    print("\nCommands: 'quit' to exit, 'reset' to start fresh\n")
    
    chat = ChatEngine(user_id="demo-user")
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if not user_input:
                continue
            if user_input.lower() == "quit":
                print("\nGoodbye! 👋")
                break
            if user_input.lower() == "reset":
                chat.reset()
                print("\n[Conversation reset - new thread started]")
                continue
            
            result = chat.chat(user_input)
            
            emotion = result["emotion"]
            score_display = "😤" * (3 - emotion["score"]) if emotion["score"] < 3 else "😊" * (emotion["score"] - 2) if emotion["score"] > 3 else "😐"
            
            print(f"\n[Emotion: {emotion['score']}/5 {emotion['label']} {score_display}]")
            print(f"[Reasoning: {emotion['reasoning'][:80]}...]" if len(emotion.get('reasoning', '')) > 80 else f"[Reasoning: {emotion.get('reasoning', '')}]")
            print(f"\nAI: {result['response']}")
            
        except KeyboardInterrupt:
            print("\n\nGoodbye! 👋")
            break
        except Exception as e:
            print(f"\nError: {e}")