from fastapi import APIRouter, status
from data import users_util

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/{user_id}")
async def get_user_by_id(user_id: str):
    return await users_util.get_user_by_id(user_id)