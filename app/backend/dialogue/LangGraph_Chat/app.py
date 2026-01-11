"""Railway/Railpack entrypoint.

Railpack auto-detects FastAPI projects best when there's an `app.py` or `main.py`
exporting a top-level `app`.

This file intentionally keeps imports minimal and re-exports the FastAPI app
defined in `server.py`.
"""

from server import app