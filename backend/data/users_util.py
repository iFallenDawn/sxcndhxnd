from entities.fastapi.schema_public_latest import Users, UsersInsert, UsersUpdate, UsersAuthInsert
from supabasedb.supabase import db
from supabase_auth.errors import AuthApiError
from datetime import datetime, timezone
from fastapi import HTTPException, status
from pydantic import EmailStr, UUID4

supabase = db()

async def get_user_by_id (
    user_id: UUID4
) -> Users: 
    query = supabase.table('users').select('*').eq('id', user_id)
    response = query.execute()
    if len(response.data) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id {user_id} not found')
    user = Users.model_validate(response.data[0])
    return user

async def get_user_by_email (
    email: EmailStr
) -> Users:
    query = supabase.table('users').select('*').eq('email', email)
    response = query.execute()
    if len(response.data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with email {email} not found')
    user = Users.model_validate(response.data[0])
    return user

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
        raise HTTPException(status_code=status.HTTP_409_BAD_REQUEST, detail=f'User with email {payload.email} already exists')
    try: 
        response = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password.get_secret_value()
        })
    except AuthApiError as e:
        raise HTTPException(
            status_code=e.status,
            detail=e.message if hasattr(e, "message") else str(e)
        )
    user_id = response.user.id if response.user else ''
    if not user_id:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Unable to create user with email {payload.email}')
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
        raise HTTPException(status_code=status.HTTP_409_BAD_REQUEST, detail=f'User with email {payload.email} already exists')
    now = datetime.now(timezone.utc)
    new_user = Users(
        **payload.model_dump()
    )
    query = supabase.table("users").insert(new_user.model_dump())
    response = query.execute()
    if len(response.data) == 0:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Unable to create user with id {payload.id}')
    return await get_user_by_id(payload.id)