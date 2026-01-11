from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, Optional, Type

logger = logging.getLogger(__name__)


try:
    from trustcall import create_extractor  # type: ignore[import]

    TRUSTCALL_AVAILABLE = True
except Exception:
    create_extractor = None
    TRUSTCALL_AVAILABLE = False


def create_trustcall_memory_extractor(
    llm: Any,
    *,
    tool_model: Type[Any],
    tool_choice: str = "ExtractedMemory",
    enable_inserts: bool = True,
) -> Optional[Any]:
    """Create a TrustCall extractor for memory extraction.

    Returns None if TrustCall isn't installed/available.
    """

    if not TRUSTCALL_AVAILABLE or create_extractor is None:
        return None

    return create_extractor(
        llm,
        tools=[tool_model],
        tool_choice=tool_choice,
        enable_inserts=enable_inserts,
    )


async def trustcall_extract(extractor: Any, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Run TrustCall extraction off the event loop.

    TrustCall's `invoke()` is sync; run it in a worker thread.
    """

    if extractor is None:
        return {}
    return await asyncio.to_thread(extractor.invoke, payload)

