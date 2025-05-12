from typing import Annotated

from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer
from ..data import users_util

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}}
)

# https://fastapi.tiangolo.com/tutorial/security/first-steps/#use-it
oauth2_scheme  = OAuth2PasswordBearer(tokenUrl='token')

# the token will be already stored in the frontend, we're using this route to validate it on the backend
@router.post("/login")
async def login(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    return await users_util.verify_token(token)