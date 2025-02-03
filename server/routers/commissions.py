from fastapi import APIRouter


# https://fastapi.tiangolo.com/tutorial/bigger-applications/#path-operations-with-apirouter

router = APIRouter(
    prefix="/commissions",
    tags=["commissions"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", tags=["commissions"])
async def get_all_commissions():
    return [{"hello": "world"}]

@router.get("/{item_id}", tags=["commissions"])
async def get_commission_by_id(item_id: str):
    return [{"hello": "world1"}]