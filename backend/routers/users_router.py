from fastapi import APIRouter, Depends, Header
from pydantic import EmailStr, UUID4
from data import users_util
from entities.fastapi.schema_public_latest import UsersBaseSchema, AuthRegister, UsersUpdate, AuthUpdateEmail
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

@router.patch("/me")
async def update_user(
    payload: UsersUpdate,
    current_user_id: UUID4 = Depends(get_current_user_id),
):
    return await users_util.update_user(payload, current_user_id)