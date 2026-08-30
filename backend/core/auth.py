from fastapi import Header
from core.exceptions import UnauthorizedError
from supabasedb.supabase import db

supabase = db()

async def get_current_user_id(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()
    
    token = authorization.removeprefix("Bearer ")
    
    try:
        response = supabase.auth.get_user(token)
    except Exception:
        raise UnauthorizedError()
    
    if response is None or response.user is None:
        raise UnauthorizedError()
    
    return response.user.id