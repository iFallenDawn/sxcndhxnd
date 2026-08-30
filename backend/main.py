from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routers import router as api_router
from core.exception_handlers import register_exception_handlers

app = FastAPI()
register_exception_handlers(app)

app.include_router(api_router)