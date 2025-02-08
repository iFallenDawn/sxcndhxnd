from fastapi import APIRouter
from ..data import users_util
from ..models.models import UserIn, UserOut

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", tags=["users"])
async def get_all_users() -> list[UserOut]:
    return await users_util.get_all_users()

@router.get("/{user_id}", tags=["users"])
async def get_user_by_id(user_id: str) -> UserOut:
    return await users_util.get_user_by_id(user_id)

# overlaps with previous route, only used for testing
# @router.get("/{user_email}", tags=["users"])
# async def get_user_by_email(user_email: str) -> UserOut:
#     return await users_util.get_user_by_email(user_email)

@router.post("/")
async def create_user(user_model: UserIn) -> UserOut:
    return await users_util.create_user(user_model)

@router.put("/{user_id}", tags=["users"])
async def update_user(user_id: str, new_user_model: UserIn) -> UserOut:
    return await users_util.update_user_put(user_id, new_user_model)