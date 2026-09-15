from entities.models import UsersBaseSchema, UsersInsert, UsersUpdate, UsersPublicProfile
from supabasedb.supabase import db, scoped_client
from datetime import datetime, timezone
from pydantic import EmailStr, UUID4
from core.exceptions import NotFoundError, ConflictError

supabase = db()

async def get_public_user_by_id(user_id: UUID4, access_token: str) -> UsersPublicProfile:
    client = scoped_client()
    client.postgrest.auth(access_token)

    query = client.table('users').select("id, first_name, last_name, instagram").eq('id', str(user_id))
    response = query.execute()

    if len(response.data) == 0:
        raise NotFoundError('User', user_id)
    
    return UsersPublicProfile.model_validate(response.data[0])

async def get_current_user(
    access_token: str,
    current_user_id: UUID4
) -> UsersBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)

    query = client.table('users').select("*").eq('id', str(current_user_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', 'current user')
    
    return UsersBaseSchema.model_validate(response.data[0])

async def get_user_by_id (
    user_id: UUID4,
    access_token: str
) -> UsersBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = client.table('users').select("*").eq('id', str(user_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', user_id)
    
    return UsersBaseSchema.model_validate(response.data[0])

async def check_user_with_email_exists (
    email: EmailStr
) -> bool:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    
    if len(response.data) == 0:
        return False
    
    return True

async def update_user(
    payload: UsersUpdate,
    current_user_id: UUID4,
    access_token: str
) -> UsersBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    updated_user = payload.model_dump(mode='json', exclude={'id'}, exclude_unset=True)
    updated_user['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    query = client.table('users').update(updated_user).eq('id', current_user_id)
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('User', current_user_id)
    
    return await get_user_by_id(current_user_id, access_token)