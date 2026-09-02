from entities.models import UsersBaseSchema, UsersInsert, UsersUpdate
from supabasedb.supabase import db
from datetime import datetime, timezone
from pydantic import EmailStr, UUID4
from core.exceptions import NotFoundError, ConflictError

supabase = db()

async def get_user_by_id (
    user_id: UUID4
) -> UsersBaseSchema: 
    query = supabase.table('users').select('*').eq('id', user_id)
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', user_id)
    return UsersBaseSchema.model_validate(response.data[0])

async def get_user_by_email (
    email: EmailStr
) -> UsersBaseSchema:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', email)
    return UsersBaseSchema.model_validate(response.data[0])

async def check_user_with_email_exists (
    email: EmailStr
) -> bool:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    
    if len(response.data) == 0:
        return False
    return True

async def create_user(
    payload: UsersInsert
) -> UsersBaseSchema:
    user_exists = await check_user_with_email_exists(payload.email)
    
    if user_exists:
        raise ConflictError(f'User with email {payload.email} already exists')
    query = supabase.table('users').insert(payload.model_dump(mode='json'))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', payload.id)
    return await get_user_by_id(payload.id)

async def update_user(
    payload: UsersUpdate,
    current_user_id: UUID4,
) -> UsersBaseSchema:
    
    updated_user = payload.model_dump(mode='json', exclude={'id'}, exclude_unset=True)
    updated_user['updated_at'] = datetime.now(timezone.utc).isoformat()
    query = supabase.table('users').update(updated_user).eq('id', current_user_id)
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', current_user_id)
    return await get_user_by_id(current_user_id)