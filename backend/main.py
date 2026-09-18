from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routers import router as api_router
from core.exception_handlers import register_exception_handlers
from core.rate_limit import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore[arg-type]

register_exception_handlers(app)
app.include_router(api_router)