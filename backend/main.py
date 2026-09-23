from dotenv import load_dotenv
load_dotenv()

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router as api_router
from core.exception_handlers import register_exception_handlers
from core.rate_limit import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Browser clients are a different origin from this API (the Vite dev server
# runs on :3000, the API on :8000), so every request from the frontend is
# cross-origin and blocked without this. Origins are configured rather than
# wildcarded because the frontend sends an Authorization header.
DEFAULT_ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS).split(",")
    if origin.strip()
]

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore[arg-type]

register_exception_handlers(app)
app.include_router(api_router)

app.frontend("/", directory="dist")