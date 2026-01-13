from __future__ import annotations

from typing import Literal, List, Any, Dict

from pydantic import BaseModel, Field

from langgraph.graph import MessagesState


class EmotionAnalysis(BaseModel):
	"""Structured emotion analysis result."""

	score: int = Field(ge=1, le=5, description="1=very frustrated to 5=very satisfied")
	label: str
	confidence: float = Field(ge=0.0, le=1.0)
	reasoning: str
	suggested_response_tone: str


class ExtractedMemory(BaseModel):
	"""Single extracted memory item."""

	memory_type: Literal["preference", "fact", "event", "relationship", "other"] = Field(
		description=(
			"The category of the memory. "
			"'preference' = communication style, likes/dislikes, formatting preferences. "
			"'fact' = stable identity info (name, job title, persistent constraints). "
			"'event' = scheduled/dated items (meetings, appointments, deadlines with times/dates). "
			"'relationship' = people connected to the user (family, friends, coworkers). "
			"'other' = durable info that doesn't fit above categories."
		)
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


class ExtractedMemories(BaseModel):
	"""Wrapper for fallback extraction."""

	memories: List[ExtractedMemory] = Field(default_factory=list)


class ChatState(MessagesState, total=False):
	"""Chat state.

	`total=False` keeps LangGraph Studio inputs minimal (only `messages` is required).
	"""

	user_id: str
	emotion_score: int  # 1-5 scale
	emotion_label: str
	emotion_reasoning: str
	response_tone: str
	memory_context: str

