from __future__ import annotations

import asyncio
import json
import logging
from typing import Dict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from schema.schema import EmotionAnalysis

logger = logging.getLogger(__name__)


EMOTION_SCALE: Dict[int, Dict[str, str]] = {
	1: {"label": "very_frustrated", "description": "Extremely upset, angry, or distressed"},
	2: {"label": "frustrated", "description": "Annoyed, bothered, or mildly upset"},
	3: {"label": "neutral", "description": "No strong emotion, matter-of-fact"},
	4: {"label": "satisfied", "description": "Positive, pleased, or content"},
	5: {"label": "very_satisfied", "description": "Extremely happy, excited, or delighted"},
}


RESPONSE_STRATEGIES: Dict[int, Dict[str, str]] = {
	1: {
		"tone": "extremely empathetic and solution-focused",
		"priority": "de-escalation and acknowledgment",
		"style": "Apologize sincerely, validate feelings, offer immediate help",
	},
	2: {
		"tone": "understanding and patient",
		"priority": "acknowledge frustration and provide support",
		"style": "Show empathy, address concerns directly, remain calm",
	},
	3: {
		"tone": "friendly and helpful",
		"priority": "provide accurate information",
		"style": "Professional, conversational, balanced",
	},
	4: {
		"tone": "warm and encouraging",
		"priority": "maintain positive momentum",
		"style": "Match their positive energy, be supportive",
	},
	5: {
		"tone": "enthusiastic and celebratory",
		"priority": "share in their joy",
		"style": "Be excited, congratulatory, amplify positivity",
	},
}


class LLMEmotionDetector:
	"""LLM-powered emotion detector using a 5-stage satisfaction scale."""

	def __init__(self, *, model_name: str, system_prompt: str):
		self.llm = ChatOpenAI(model=model_name, temperature=0.1)
		self.system_prompt = system_prompt

	async def analyze(self, message: str, context: str = "") -> EmotionAnalysis:
		context_text = f"\nRecent context: {context}" if context else ""

		user_prompt = f"""Analyze this message:{context_text}

MESSAGE: \"{message}\"

Return JSON only."""

		try:
			response = await self.llm.ainvoke(
				[SystemMessage(content=self.system_prompt), HumanMessage(content=user_prompt)]
			)

			content = (response.content or "").strip()
			if "```json" in content:
				content = content.split("```json", 1)[1].split("```", 1)[0]
			elif "```" in content:
				content = content.split("```", 1)[1].split("```", 1)[0]

			data = json.loads(content.strip())
			score = max(1, min(5, int(data.get("score", 3))))

			return EmotionAnalysis(
				score=score,
				label=data.get("label", EMOTION_SCALE[score]["label"]),
				confidence=float(data.get("confidence", 0.8)),
				reasoning=data.get("reasoning", ""),
				suggested_response_tone=data.get(
					"suggested_response_tone", RESPONSE_STRATEGIES[score]["tone"]
				),
			)
		except Exception as e:
			logger.exception("Emotion analysis failed")
			return EmotionAnalysis(
				score=3,
				label="neutral",
				confidence=0.5,
				reasoning=f"Analysis error: {e}",
				suggested_response_tone=RESPONSE_STRATEGIES[3]["tone"],
			)

	def analyze_sync(self, message: str, context: str = "") -> EmotionAnalysis:
		return asyncio.run(self.analyze(message, context))

