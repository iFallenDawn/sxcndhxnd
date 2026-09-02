from typing import Any, cast
from fastapi import Header, Depends
from core.exceptions import UnauthorizedError, ForbiddenError
from supabasedb.supabase import db
from pydantic import UUID4
from uuid import UUID

supabase = db()

async def get_current_user_id(authorization: str = Header(None)) -> UUID:
    if not authorization or not authorization.startswith('Bearer '):
        raise UnauthorizedError()
    
    token = authorization.removeprefix('Bearer ')
    
    try:
        response = supabase.auth.get_user(token)
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