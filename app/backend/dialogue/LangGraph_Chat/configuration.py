"""
Configuration module for Chat MVP.
Handles environment variables and runtime configuration.
"""

import os
from dataclasses import dataclass, field, fields
from typing import Any, Optional
from dotenv import load_dotenv

from langchain_core.runnables import RunnableConfig

# Load environment variables from .env file
load_dotenv()


@dataclass(kw_only=True)
class Configuration:
    """The configurable fields for the chatbot."""
    
    # User identification
    user_id: str = "default-user"
    
    # Model settings
    model_name: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 1024

    # Extractor (memory/emotion) model settings
    extractor_model_name: str = "gpt-4o-mini"
    extractor_temperature: float = 0.0
    
    # Memory settings
    max_short_term_messages: int = 20
    enable_long_term_memory: bool = True
    
    # Emotion settings
    enable_emotion_simulation: bool = True
    emotion_intensity_multiplier: float = 1.0

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = (
            config["configurable"] if config and "configurable" in config else {}
        )
        values: dict[str, Any] = {
            f.name: os.environ.get(f.name.upper(), configurable.get(f.name))
            for f in fields(cls)
            if f.init
        }
        return cls(**{k: v for k, v in values.items() if v})
    
    @classmethod
    def get_openai_api_key(cls) -> str:
        """Get OpenAI API key from environment."""
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY not found in environment variables. "
                "Please set it in your .env file or environment."
            )
        return api_key
    
    @classmethod
    def get_tavily_api_key(cls) -> str:
        """Get Tavily API key from environment."""
        api_key = os.environ.get("TAVILY_API_KEY")
        if not api_key:
            raise ValueError(
                "TAVILY_API_KEY not found in environment variables. "
                "Please set it in your .env file or environment."
            )
        return api_key

# Default configuration instance
default_config = Configuration()