from __future__ import annotations

from enum import StrEnum


class OpenAIModelName(StrEnum):
    """OpenAI chat model names."""

    GPT_4O_MINI = "gpt-4o-mini"
    GPT_4O = "gpt-4o"
    GPT_5_2_NANO = "gpt-5.2-nano"

# Defaults for this project.
DEFAULT_CHAT_MODEL: OpenAIModelName = OpenAIModelName.GPT_4O
DEFAULT_EXTRACTOR_MODEL: OpenAIModelName = OpenAIModelName.GPT_4O_MINI


_ALLOWED_MODEL_VALUES: set[str] = {str(m) for m in OpenAIModelName}


def is_valid_model_name(name: str | StrEnum | None) -> bool:
    if name is None:
        return False
    return str(name) in _ALLOWED_MODEL_VALUES


def resolve_model_name(
    name: str | StrEnum | None,
    *,
    default: OpenAIModelName = DEFAULT_CHAT_MODEL,
) -> str:
    """Return a valid OpenAI model name string.

    If `name` is invalid/unknown, return `default`.
    """

    if is_valid_model_name(name):
        return str(name)
    return str(default)

