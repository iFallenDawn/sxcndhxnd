from fastapi import APIRouter, Depends, Header
from pydantic import UUID4
from data import users_util
from entities.models import  UsersBaseSchema
from core.auth import require_admin
from core.exceptions import UnauthorizedError

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}}
)

@router.get("/users/{user_id}")
async def get_user_admin(
    user_id: UUID4,
    authorization: str = Header(None),
    _: UUID4 = Depends(require_admin),
) -> UsersBaseSchema:
    print('hello world')
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError()
        
    access_token = authorization.removeprefix("Bearer ")
    return await users_util.get_user_by_id(user_id, access_token)