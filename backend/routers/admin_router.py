from fastapi import APIRouter, Depends, Header
from pydantic import UUID4
from data import users_util
from entities.models import  UsersBaseSchema
from core.auth import require_admin, get_access_token
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}}
)

@router.get("/users/{user_id}")
async def get_user_admin(
    user_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin),
) -> UsersBaseSchema:
    return await users_util.get_user_by_id(user_id, access_token)