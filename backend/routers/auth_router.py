from fastapi import APIRouter, Depends, Header
from data import auth_util
from entities.models import AuthRegister, AuthUpdateEmail, AuthSignIn, AuthSignOut, AuthChangePassword, AuthRefresh
from core.exceptions import UnauthorizedError
from core.auth import get_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}}
)

@router.post("/sign-in")
async def sign_in(payload: AuthSignIn):
    return await auth_util.sign_in(payload.email, payload.password)

@router.post("/refresh")
async def refresh_session(payload: AuthRefresh):
    return await auth_util.refresh_session(payload.refresh_token)

@router.post("/register")
async def create_user(payload: AuthRegister):
    return await auth_util.create_user_from_auth(payload)

@router.patch("/email")
async def update_user_email(
    payload: AuthUpdateEmail,
    access_token: str = Depends(get_access_token)
):  
    await auth_util.update_user_email(
        access_token,
        payload.refresh_token,
        payload.new_email
    )
    return {"detail": "Confirmation email sent to new address"}

@router.post("/sign-out")
async def sign_out(
    payload: AuthSignOut, 
    access_token: str = Depends(get_access_token)
): 
    await auth_util.sign_out(access_token, payload.refresh_token)
    return {"detail": "Signed out successfully"}

@router.patch("/password")
async def change_password(
    payload: AuthChangePassword, 
    access_token: str = Depends(get_access_token)
):    
    await auth_util.change_password(
        access_token, 
        payload.refresh_token,
        payload.current_password,
        payload.new_password)
    return {"detail": "Password changed successfully"}
