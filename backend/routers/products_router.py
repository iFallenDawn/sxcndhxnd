from fastapi import APIRouter, Depends
from pydantic import UUID4
from data import products_util
from entities.models import ProductsBaseSchema, ProductsUpdate, ProductsInsert
from core.auth import require_admin

router = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Not found"}}
)

@router.get("/")
async def get_all_products() -> list[ProductsBaseSchema]:
    return await products_util.get_all_products()

@router.get("/{product_id}")
async def get_product_by_id(product_id: UUID4) -> ProductsBaseSchema:
    return await products_util.get_product_by_id(product_id)

@router.post("/")
async def create_product(
    payload: ProductsInsert,
    current_user_id: UUID4 = Depends(require_admin),
):
    return await products_util.create_product(payload, current_user_id)

@router.patch('/{product_id}')
async def update_product(
    product_id: UUID4,
    payload: ProductsUpdate,
    current_user_id: UUID4 = Depends(require_admin)
):
    return await products_util.update_product(product_id, payload, current_user_id)
