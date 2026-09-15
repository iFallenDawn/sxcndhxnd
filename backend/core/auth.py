from typing import Any, cast
from fastapi import Header, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.exceptions import UnauthorizedError, ForbiddenError
from supabasedb.supabase import db
from pydantic import UUID4
from uuid import UUID

supabase = db()
bearer_scheme = HTTPBearer()

async def get_access_token(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> str:
    if credentials is None:
        raise UnauthorizedError()
    
    return credentials.credentials

async def get_current_user_id(access_token: str = Depends(get_access_token)) -> UUID:
    try:
        response = supabase.auth.get_user(access_token)
    except Exception:
        raise UnauthorizedError()
    
    if response is None or response.user is None:
        raise UnauthorizedError()
    
    return UUID(response.user.id)

async def get_user_role(user_id: UUID4) -> str | None:
    query = supabase.table('users_roles').select('role').eq('id', str(user_id))
    response = query.execute()
    rows = cast(list[dict[str, Any]], response.data)
    
    if not rows:
        return None
        
    return rows[0]['role']

async def require_admin(current_user_id: UUID4 = Depends(get_current_user_id)) -> UUID4:
    role = await get_user_role(current_user_id)
    
    if role != 'admin':
        raise ForbiddenError('Admin access required')
    
    return current_user_id