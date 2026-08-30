import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from postgrest.exceptions import APIError
from supabase_auth.errors import AuthApiError
from pydantic import ValidationError
from core.exceptions import NotFoundError, ConflictError

logger = logging.getLogger(__name__)

def register_exception_handlers(app):
    @app.exception_handler(NotFoundError)
    async def not_found_exception_handler(request: Request, exc: NotFoundError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)}
        )
        
    @app.exception_handler(ConflictError)
    async def conflict_exception_handler(request: Request, exc: ConflictError):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": exc.message}
        )
    
    @app.exception_handler(APIError)
    async def postgrest_exception_handler(request: Request, exc: APIError):
        logger.error(f"Supabase/Postgrest error: {exc.code} - {exc.message}")
        pg_code_map = {
            "23505": status.HTTP_409_CONFLICT,       # unique_violation
            "23503": status.HTTP_400_BAD_REQUEST,    # foreign_key_violation
            "42501": status.HTTP_403_FORBIDDEN,      # insufficient_privilege / RLS
        }
        code = exc.code
        if code:
            code = pg_code_map.get(code, status.HTTP_400_BAD_REQUEST) 
        else: 
            code = status.HTTP_400_BAD_REQUEST
        return JSONResponse(
            status_code=code,
            content={"detail": exc.message}
        )
    
    @app.exception_handler(AuthApiError)
    async def auth_exception_handler(request: Request, exc: AuthApiError):
        logger.error(f"Supabase auth error: {exc}")
        message = str(exc)
        if hasattr(exc, "message"):
            message = exc.message
        return JSONResponse(
            status_code=exc.status or status.HTTP_400_BAD_REQUEST,
            content={"detail": message}
        )
    
    # called when we use pydantic.model_validate
    @app.exception_handler(ValidationError)
    async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
        logger.error(f"Data integrity error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Data integrity error", "errors": exc.errors()}
        )
        
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Request validation error: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            content={
                "detail": "Invalid request data",
                "errors": jsonable_encoder(exc.errors())
            }
        )
        
    @app.exception_handler(Exception)
    async def catch_all_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"}
        )