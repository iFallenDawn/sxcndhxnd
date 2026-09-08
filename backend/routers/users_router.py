from fastapi import APIRouter, Depends, Header
from pydantic import UUID4
from data import users_util
from entities.models import UsersPublicProfile, UsersUpdate, UsersBaseSchema
from core.auth import get_current_user_id
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/{user_id}")
async def get_public_user_by_id(
    user_id: UUID4,
    authorization: str = Header(None),
) -> UsersPublicProfile:
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()

    access_token = authorization.removeprefix("Bearer ")
    return await users_util.get_public_user_by_id(user_id, access_token)

@router.get("/me")
async def get_current_user(
    authorization: str = Header(None)
) -> UsersBaseSchema:
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()
    
    access_token = authorization.removeprefix("Bearer ")
    return await users_util.get_current_user(access_token)

@router.patch("/me")
async def update_user(
    payload: UsersUpdate,
    authorization: str = Header(None),
    current_user_id: UUID4 = Depends(get_current_user_id),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()
        
    access_token = authorization.removeprefix("Bearer ")
    return await users_util.update_user(payload, current_user_id, access_token)