from entities.models import GalleryImagesBaseSchema, GalleryImagesInsert, GalleryResponse
from data.products_util import get_all_gallery_products
from supabasedb.supabase import db, scoped_client
from core.exceptions import NotFoundError, InvalidFileTypeError, FailedToDeleteFromBucketError
from pydantic import UUID4
from fastapi import UploadFile
import asyncio
from uuid import uuid4
from core.constants import ALLOWED_CONTENT_TYPES
from core.storage import extract_storage_path

supabase = db()

async def get_gallery_images() -> list[GalleryImagesBaseSchema]:
    query = supabase.table('gallery_images').select()
    response = query.execute()
    result = [GalleryImagesBaseSchema.model_validate(row) for row in response.data]
    return result

async def get_gallery_image_by_id(gallery_image_id: UUID4) -> GalleryImagesBaseSchema:
    query = supabase.table('gallery_images').select('*').eq('id', str(gallery_image_id))
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError('Gallery image', gallery_image_id)
    
    return GalleryImagesBaseSchema.model_validate(response.data[0])

async def get_full_gallery() -> GalleryResponse:
    products, gallery_images = await asyncio.gather(
        get_all_gallery_products(),
        get_gallery_images()
    )
    return GalleryResponse(products=products, gallery_images=gallery_images)
    

async def upload_gallery_image(
    file: UploadFile,
    description: str | None,
    access_token: str,
    created_by: UUID4,
) -> GalleryImagesBaseSchema:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise InvalidFileTypeError(file.content_type)
    
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    contents = await file.read()
    file_path = f"gallery/{uuid4()}-{file.filename}"
    
    client.storage.from_('gallery-images').upload(
        file_path, contents, {"content-type": file.content_type}
    )
    
    image_url = client.storage.from_('gallery-images').get_public_url(file_path)
    
    gallery_image = GalleryImagesInsert(image_url=image_url, description=description)
    
    new_gallery_image = {
        "id": str(gallery_image.id),
        "image_url": image_url,
        "description": description,
        "created_by": str(created_by)
    }
    
    query = client.table('gallery_images').insert(new_gallery_image)
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError('Gallery image', gallery_image.id)
    
    return GalleryImagesBaseSchema.model_validate(response.data[0])

async def delete_gallery_image(
    gallery_image_id: UUID4,
    access_token: str
) -> GalleryImagesBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = client.table('gallery_images').delete().eq('id', str(gallery_image_id))
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError('Gallery image', gallery_image_id)
    
    gallery_image = GalleryImagesBaseSchema.model_validate(response.data[0])
    
    bucket_file_path = extract_storage_path(gallery_image.image_url, bucket='gallery-images')
    try:
        client.storage.from_('gallery-images').remove([bucket_file_path])
    except:
        raise FailedToDeleteFromBucketError(gallery_image_id, bucket='gallery-images')
    
    return gallery_image