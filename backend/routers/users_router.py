from fastapi import APIRouter, Depends, Header
from pydantic import UUID4
from data import users_util
from entities.models import UsersPublicProfile, UsersUpdate, UsersBaseSchema
from core.auth import get_access_token, get_current_user_id
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/me")
async def get_current_user(
    access_token: str = Depends(get_access_token),
    current_user_id: UUID4 = Depends(get_current_user_id)
) -> UsersBaseSchema:
    return await users_util.get_current_user(access_token, current_user_id)

@router.get("/{user_id}")
async def get_public_user_by_id(
    user_id: UUID4,
    access_token: str = Depends(get_access_token),
) -> UsersPublicProfile:
    return await users_util.get_public_user_by_id(user_id, access_token)

@router.patch("/me")
async def update_user(
    payload: UsersUpdate,
    access_token: str = Depends(get_access_token),
    current_user_id: UUID4 = Depends(get_current_user_id)
):
    return await users_util.update_user(payload, current_user_id, access_token)