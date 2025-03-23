from fastapi import APIRouter, status
from ..data import users_util
from ..models.models import UserIn, UserOut

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/")
async def get_all_users() -> list[UserOut]:
    return await users_util.get_all_users()

@router.get("/{user_id}")
async def get_user_by_id(user_id: str) -> UserOut:
    return await users_util.get_user_by_id(user_id)

# overlaps with previous route, only used for testing
# @router.get("/{user_email}", tags=["users"])
# async def get_user_by_email(user_email: str) -> UserOut:
#     return await users_util.get_user_by_email(user_email)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user_model: UserIn) -> UserOut:
    return await users_util.create_user(user_model)

# replace the entire user
@router.put("/{user_id}", status_code=status.HTTP_201_CREATED)
async def update_user_by_put(user_id: str, new_user_model: UserIn) -> UserOut:
    return await users_util.update_user_put(user_id, new_user_model)

# only use patch to update first_name, last_name, instagram, commission_ids, product_ids. DO NOT USE to update email or password, use put
@router.patch("/{user_id}", status_code=status.HTTP_201_CREATED)
async def update_user_by_patch(user_id: str, new_user_model: dict) -> UserOut:
    return await users_util.update_user_patch(user_id, new_user_model)

@router.delete("/{user_id}")
async def delete_user(user_id: str) -> UserOut:
    return await users_util.delete_user(user_id)