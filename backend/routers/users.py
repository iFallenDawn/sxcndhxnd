from fastapi import APIRouter, status
from pydantic import EmailStr, SecretStr, UUID4
from data import users_util
from entities.fastapi.schema_public_latest import Users, UsersInsert, UsersAuthInsert

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/id/{user_id}")
async def get_user_by_id(user_id: UUID4) -> Users:
    return await users_util.get_user_by_id(user_id)

@router.get("/email/{email}")
async def get_user_by_email(email: EmailStr) -> Users:
    return await users_util.get_user_by_email(email)

@router.post("/register")
async def create_user(payload: UsersAuthInsert):
    return await users_util.create_user_from_auth(payload)