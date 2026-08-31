from fastapi import APIRouter, Depends, Header
from data import auth_util
from entities.fastapi.schema_public_latest import AuthRegister, AuthUpdateEmail, AuthSignIn, AuthSignOut, AuthChangePassword
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}}
)

@router.post("/sign-in")
async def sign_in(payload: AuthSignIn):
    return await auth_util.sign_in(payload.email, payload.password)

@router.post("/register")
async def create_user(payload: AuthRegister):
    return await auth_util.create_user_from_auth(payload)

@router.patch("/email")
async def update_user_email(
    payload: AuthUpdateEmail,
    authorization: str = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()

    access_token = authorization.removeprefix("Bearer ")
    
    await auth_util.update_user_email(
        access_token,
        payload.refresh_token,
        payload.new_email
    )
    return {"detail": "Confirmation email sent to new address"}

@router.get("/sign-out")
async def sign_out(payload: AuthSignOut, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()

    access_token = authorization.removeprefix("Bearer ")
    
    await auth_util.sign_out(access_token, payload.refresh_token)
    return {"detail": "Signed out successfully"}

@router.patch("/password")
async def change_password(payload: AuthChangePassword, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()
    
    access_token = authorization.removeprefix("Bearer ")
    
    await auth_util.change_password(
        access_token, 
        payload.refresh_token,
        payload.current_password,
        payload.new_password)
    
    return {"detail": "Password changed successfully"}
