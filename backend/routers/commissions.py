from fastapi import APIRouter
from ..data import commissions_util

# we'll use commissions as our super documented example

# https://fastapi.tiangolo.com/tutorial/bigger-applications/#path-operations-with-apirouter

router = APIRouter(
    prefix="/commissions",
    tags=["commissions"],
    responses={404: {"description": "Not found"}}
)


# https://fastapi.tiangolo.com/tutorial/handling-errors/ for errors

@router.get("/", tags=["commissions"])
async def get_all_commissions():
    return await commissions_util.get_all_commissions()

@router.get("/{commission_id}", tags=["commissions"])
async def get_commission_by_id(commission_id: str):
    return await commissions_util.get_commission_by_id(commission_id)