"""
FastAPI server wrapping the LangGraph ChatEngine.
"""

import os
import uuid
from typing import Dict, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
from ai.agents.agent import ChatEngine, in_memory_store, checkpointer


# ---------------------------------------------------------------------------
# Session Management (in-memory)
# ---------------------------------------------------------------------------

_sessions: Dict[str, ChatEngine] = {}


def _session_key(user_id: str, thread_id: Optional[str]) -> str:
    return f"{user_id}:{thread_id}" if thread_id else user_id


def _is_user_key(key: str, user_id: str) -> bool:
    return key == user_id or key.startswith(f"{user_id}:")


def get_or_create_session(user_id: str, thread_id: Optional[str] = None) -> ChatEngine:
    """Get existing session or create a new one for the user/thread."""
    if thread_id:
        key = _session_key(user_id, thread_id)
        if key not in _sessions:
            _sessions[key] = ChatEngine(
                user_id=user_id,
                thread_id=thread_id,
                store=in_memory_store,
                checkpointer=checkpointer,
            )
        return _sessions[key]

    # No thread specified: create a new session so we get a new thread_id
    engine = ChatEngine(
        user_id=user_id,
        store=in_memory_store,
        checkpointer=checkpointer,
    )
    _sessions[_session_key(user_id, engine.thread_id)] = engine
    return engine


def reset_session(user_id: str, thread_id: Optional[str] = None) -> None:
    """Reset a user's session.

    If thread_id is provided, reset that conversation. Otherwise reset all
    conversations for the user.
    """
    if thread_id:
        key = _session_key(user_id, thread_id)
        if key in _sessions:
            _sessions[key].reset()
        return

    for key, engine in list(_sessions.items()):
        if _is_user_key(key, user_id):
            engine.reset()


# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Request body for /chat endpoint."""
    message: str = Field(..., min_length=1, description="User message")
    user_id: Optional[str] = Field(default=None, description="User ID for session tracking")
    thread_id: Optional[str] = Field(default=None, description="Thread ID for conversation threading")


class ChatResponse(BaseModel):
    """Response from /chat endpoint."""
    ok: bool = True
    response: str
    emotion: dict
    user_id: str
    thread_id: str


class ResetRequest(BaseModel):
    """Request body for /reset endpoint."""
    user_id: str = Field(..., min_length=1)
    thread_id: Optional[str] = Field(default=None, description="Thread ID to reset (optional)")


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    print("🚀 LangGraph Agent server starting...")
    yield
    print("👋 LangGraph Agent server shutting down...")


app = FastAPI(
    title="LangGraph Chat Agent",
    description="FastAPI wrapper for the LangGraph ChatEngine with emotion detection and memory",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Send a message to the LangGraph agent and get a response.
    
    - Uses emotion detection to adapt response tone
    - Maintains short-term memory per session
    - Sessions are keyed by user_id
    """
    user_id = req.user_id or f"anon-{uuid.uuid4().hex[:8]}"
    
    try:
        engine = get_or_create_session(user_id, req.thread_id)
        result = await engine.achat(req.message)
        
        return ChatResponse(
            ok=True,
            response=result["response"],
            emotion=result["emotion"],
            user_id=user_id,
            thread_id=engine.thread_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/reset")
async def reset(req: ResetRequest):
    """Reset a user's conversation session."""
    reset_session(req.user_id, req.thread_id)
    suffix = f" thread {req.thread_id}" if req.thread_id else ""
    return {"ok": True, "message": f"Session reset for user {req.user_id}{suffix}"}


@app.get("/sessions")
async def list_sessions():
    """List active session user IDs (for debugging)."""
    return {
        "ok": True,
        "sessions": list(_sessions.keys()),
        "count": len(_sessions),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
