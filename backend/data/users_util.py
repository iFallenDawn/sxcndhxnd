from entities.fastapi.schema_public_latest import Users, UsersInsert, UsersUpdate, UsersAuthInsert
from supabasedb.supabase import db
from datetime import datetime, timezone
from pydantic import EmailStr, UUID4
from core.exceptions import NotFoundError, ConflictError

supabase = db()

async def get_user_by_id (
    user_id: UUID4
) -> Users: 
    query = supabase.table('users').select('*').eq('id', user_id)
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError("User", user_id)
    return Users.model_validate(response.data[0])

async def get_user_by_email (
    email: EmailStr
) -> Users:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError("User", email)
    return Users.model_validate(response.data[0])

async def check_user_with_email_exists (
    email: EmailStr
) -> bool:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    if len(response.data) == 0:
        return False
    return True

async def create_user_from_auth(
    payload: UsersAuthInsert
):
    user_exists = await check_user_with_email_exists(payload.email)
    if user_exists:
        raise ConflictError(f'User with email {payload.email} already exists')
    response = supabase.auth.sign_up({
        "email": payload.email,
        "password": payload.password.get_secret_value()
    })
    user_id = response.user.id if response.user else None
    if not user_id:
        raise NotFoundError("Auth user", payload.email)
    now = datetime.now(timezone.utc)
    new_payload = UsersInsert.model_validate({
        "id": user_id,
        "email": payload.email,
        "first_name": payload.first_name,
        "instagram": payload.instagram,
        "last_name": payload.last_name,
        "created_at": now,
        "updated_at": now
    })
    return await create_user(new_payload)

async def create_user(
    payload: UsersInsert
) -> Users:
    user_exists = await check_user_with_email_exists(payload.email)
    if user_exists:
        raise ConflictError(f'User with email {payload.email} already exists')
    query = supabase.table("users").insert(payload.model_dump(mode="json"))
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError("User", payload.id)
    return await get_user_by_id(payload.id)