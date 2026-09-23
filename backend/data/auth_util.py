from entities.models import AuthRegister, AuthConfirm, UsersInsert
from supabasedb.supabase import db, scoped_client
from data.users_util import check_user_with_email_exists
from core.exceptions import NotFoundError, ConflictError, ForbiddenError, UnauthorizedError
from datetime import datetime, timezone
from pydantic import EmailStr, SecretStr
from supabase_auth.errors import AuthApiError, AuthError

supabase = db()

def _session_response(response, error_message: str) -> dict:
    """Token payload from a Supabase auth response, or 401 if it has no session."""
    if response.session is None or response.user is None:
        raise UnauthorizedError(error_message)

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user_id": response.user.id,
    }

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

    return _session_response(response, "Invalid email or password")

async def refresh_session(refresh_token: str) -> dict:
    client = scoped_client()

    try:
        response = client.auth.refresh_session(refresh_token)
    except AuthError:
        raise UnauthorizedError("Invalid or expired refresh token")

    return _session_response(response, "Invalid or expired refresh token")

async def confirm(payload: AuthConfirm) -> dict:
    client = scoped_client()

    try:
        response = client.auth.verify_otp({
            "token_hash": payload.token_hash,
            "type": payload.type,
        })
    except AuthError:
        raise UnauthorizedError("Invalid or expired confirmation link")

    return _session_response(response, "Invalid or expired confirmation link")

async def create_user_from_auth(
    payload: AuthRegister
):
    user_exists = await check_user_with_email_exists(payload.email)
    
    if user_exists:
        raise ConflictError(f'User with email {payload.email} already exists')
    
    client = scoped_client()
    try:
        response = client.auth.sign_up({
            "email": payload.email,
            "password": payload.password.get_secret_value(),
            "options": {
                "data": {
                    "first_name": payload.first_name,
                    "last_name": payload.last_name,
                    "instagram": payload.instagram,
                }
            }
        })
    except AuthApiError:
        raise
    except AuthError:
        raise UnauthorizedError("Could not create account")
    
    if response.user is None:
        raise UnauthorizedError("Could not create account")
    
    return {
        "detail": "Account created. Please check your email to confirm your account before signing in.",
        "user_id": response.user.id,
    }

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