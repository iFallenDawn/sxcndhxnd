from entities.models import AuthRegister, UsersInsert
from supabasedb.supabase import db, scoped_client
from data.users_util import check_user_with_email_exists, create_user
from core.exceptions import NotFoundError, ConflictError, ForbiddenError, UnauthorizedError
from datetime import datetime, timezone
from pydantic import EmailStr, SecretStr
from supabase_auth.errors import AuthApiError, AuthError

supabase = db()

async def sign_in(email: EmailStr, password: SecretStr) -> dict:
    client = scoped_client()
    try:
        response = client.auth.sign_in_with_password({
            "email": email,
            "password": password.get_secret_value(),
        })
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid email or password")

    if response.session is None or response.user is None:
        raise UnauthorizedError("Invalid email or password")

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user_id": response.user.id,
    }
        

async def create_user_from_auth(
    payload: AuthRegister
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

async def update_user_email(
    access_token: str,
    refresh_token: str,
    new_email: EmailStr
) -> None:
    client = scoped_client()
    
    try:
        client.auth.set_session(access_token, refresh_token)
        client.auth.update_user({"email": new_email})
    except AuthApiError:
        raise # bubble up the exception
    except AuthError:
        raise UnauthorizedError("Invalid or expired session, please log in again")

async def sign_out(
    access_token: str, 
    refresh_token: str
):
    client = scoped_client()
    try:
        client.auth.set_session(access_token, refresh_token)
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid or expired session")
    
    try:
        client.auth.sign_out()
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid or expired session")
    
async def change_password(
    access_token: str, 
    refresh_token: str,
    current_password: SecretStr,
    new_password: SecretStr
) -> None:
    client = scoped_client()
    
    # set session so we know who is calling
    try:
        client.auth.set_session(access_token, refresh_token)
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid or expired session, please log in again")
    
    # get data from current user session
    try:
        user_response = client.auth.get_user()
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid or expired session, please log in again")
    
    if user_response is None or user_response.user is None or not user_response.user.email:
        raise UnauthorizedError("Invalid or expired session, please log in again")
    
    email = user_response.user.email
    
    # double check the user can sign in with their old password
    try:
        client.auth.sign_in_with_password({
            "email": email,
            "password": current_password.get_secret_value(),
        })
    except AuthError:
        raise UnauthorizedError("Current password is incorrect")
    
    # change the password
    try:
        client.auth.update_user({"password": new_password.get_secret_value()})
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Invalid or expired session, please log in again")