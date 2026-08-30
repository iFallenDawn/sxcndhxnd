from fastapi import APIRouter, Depends, Header
from pydantic import EmailStr, UUID4
from data import users_util
from entities.fastapi.schema_public_latest import UsersBaseSchema, UsersAuthInsert, UsersUpdate, UsersUpdateEmail
from core.auth import get_current_user_id
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/id/{user_id}")
async def get_user_by_id(user_id: UUID4) -> UsersBaseSchema:
    return await users_util.get_user_by_id(user_id)

@router.get("/email/{email}")
async def get_user_by_email(email: EmailStr) -> UsersBaseSchema:
    return await users_util.get_user_by_email(email)

@router.post("/register")
async def create_user(payload: UsersAuthInsert):
    return await users_util.create_user_from_auth(payload)

@router.patch("/update")
async def update_user(
    payload: UsersUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    return await users_util.update_user(payload, current_user_id)

@router.patch("/email")
async def update_user_email(
    payload: UsersUpdateEmail,
    authorization: str = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()

    access_token = authorization.removeprefix("Bearer ")
    
    await users_util.update_user_email(
        access_token=access_token,
        refresh_token=payload.refresh_token,
        new_email=payload.new_email
    )
    return {"detail": "Confirmation email sent to new address"}