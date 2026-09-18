from fastapi import APIRouter, Depends, UploadFile, Request
from pydantic import UUID4
from data import products_util, reservations_util
from entities.models import ProductsBaseSchema, ProductsUpdate, ProductsInsert, ReserveProductRequest
from core.auth import require_admin, get_access_token, get_optional_user_id
from core.rate_limit import limiter

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
) -> ProductsBaseSchema:
    return await products_util.create_product(payload, current_user_id)

@router.patch('/{product_id}')
async def update_product(
    product_id: UUID4,
    payload: ProductsUpdate,
    current_user_id: UUID4 = Depends(require_admin)
) -> ProductsBaseSchema:
    return await products_util.update_product(product_id, payload, current_user_id)

@router.delete('/{product_id}')
async def delete_product(
    product_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> ProductsBaseSchema:
    return await products_util.delete_product(product_id, access_token)

@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> dict:
    return await products_util.upload_product_image(file, access_token)

@router.post("/{product_id}/reserve")
@limiter.limit("5/minute")
async def reserve_product(
    request: Request,
    product_id: UUID4,
    payload: ReserveProductRequest,
    current_user_id: UUID4 | None = Depends(get_optional_user_id)
) -> ProductsBaseSchema:
    return await reservations_util.create_reservation(product_id, payload.instagram, current_user_id)