from fastapi import APIRouter, Depends, UploadFile, Form
from pydantic import UUID4
from data import gallery_util
from entities.models import GalleryImagesBaseSchema, GalleryResponse
from core.auth import require_admin, get_access_token

router = APIRouter(
    prefix="/gallery",
    tags=["gallery"],
    responses={404: {"description": "Not found"}}
)

@router.get("/")
async def get_gallery_images() -> GalleryResponse:
    return await gallery_util.get_full_gallery()

@router.get('/{gallery_image_id}') 
async def get_gallery_image_by_id(gallery_image_id: UUID4) -> GalleryImagesBaseSchema:
    return await gallery_util.get_gallery_image_by_id(gallery_image_id)

@router.post("/")
async def upload_gallery_image(
    file: UploadFile,
    description: str | None = Form(default=None),
    access_token: str = Depends(get_access_token),
    current_user_id: UUID4 = Depends(require_admin)
) -> GalleryImagesBaseSchema:
    return await gallery_util.upload_gallery_image(file, description, access_token, current_user_id)

@router.delete('/{gallery_image_id}')
async def delete_gallery_image(
    gallery_image_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> GalleryImagesBaseSchema:
    return await gallery_util.delete_gallery_image(gallery_image_id, access_token)