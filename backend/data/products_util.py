from entities.models import ProductsBaseSchema, ProductsInsert, ProductsUpdate, ReserveProductRequest
from supabasedb.supabase import db, scoped_client
from core.exceptions import NotFoundError, InvalidFileTypeError, FailedToDeleteFromBucketError, ConflictError
from pydantic import UUID4
from datetime import datetime, timezone
from fastapi import UploadFile
from uuid import uuid4
from core.constants import ALLOWED_CONTENT_TYPES, PRODUCT_GALLERY_STATUSES
from core.storage import extract_storage_path
import logging

logger = logging.getLogger(__name__)
supabase = db()

async def get_all_products() -> list[ProductsBaseSchema]:
    query = supabase.table('products').select()
    response = query.execute()
    result = [ProductsBaseSchema.model_validate(row) for row in response.data]
    return result

async def get_all_gallery_products() -> list[ProductsBaseSchema]:
    query = supabase.table('products').select('*').in_('status', PRODUCT_GALLERY_STATUSES)
    response = query.execute()
    return [ProductsBaseSchema.model_validate(row) for row in response.data]

async def get_product_by_id(
    product_id: UUID4
) -> ProductsBaseSchema:
    query = supabase.table('products').select('*').eq('id', str(product_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('Product', product_id)
    
    return ProductsBaseSchema.model_validate(response.data[0])

async def create_product(
    payload: ProductsInsert, 
    created_by: UUID4
) -> ProductsBaseSchema:
    new_product = payload.model_dump(mode="json", exclude_unset=True)
    new_product['id'] = str(payload.id)
    new_product['updated_at'] = datetime.now(timezone.utc).isoformat()
    new_product['created_by'] = str(created_by)
    new_product['updated_by'] = str(created_by)
    
    query = supabase.table('products').insert(new_product)
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('Product', payload.id)
    
    return await get_product_by_id(payload.id)

async def update_product(
    product_id: UUID4, 
    payload: ProductsUpdate, 
    current_user_id: UUID4
) -> ProductsBaseSchema:
    updated_product = payload.model_dump(mode='json', exclude_unset=True)
    updated_product['updated_at'] = datetime.now(timezone.utc).isoformat()
    updated_product['updated_by'] = str(current_user_id)
    
    query = supabase.table('products').update(updated_product).eq('id', str(product_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('Product', product_id)
    
    return await get_product_by_id(product_id)

async def delete_product(
    product_id: UUID4,
    access_token: str
) -> ProductsBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = client.table('products').delete().eq('id', str(product_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('Product', product_id)
    
    product = ProductsBaseSchema.model_validate(response.data[0])
    
    for url in product.image_urls:
        bucket_file_path = extract_storage_path(url, bucket='product-images')
        try:
            client.storage.from_('product-images').remove([bucket_file_path])
        except:
            raise FailedToDeleteFromBucketError(product_id, bucket='product-images')
    
    return product

async def upload_product_image(
    file: UploadFile,
    access_token: str
) -> dict:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise InvalidFileTypeError(file.content_type)
    
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    contents = await file.read()
    file_path = f"products/{uuid4()}-{file.filename}"
    
    client.storage.from_('product-images').upload(
        file_path, contents, {"content-type": file.content_type}
    )
    
    image_url = client.storage.from_('product-images').get_public_url(file_path)
    return {"image_url": image_url}

async def reserve_product(
    product_id: UUID4,
) -> ProductsBaseSchema:
    updated_fields = {
        "status": "reserved", 
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    query = (
        supabase.table('products')
            .update(updated_fields)
            .eq('id', str(product_id))
            .eq('status', 'available')
    )
    response = query.execute()
    if len(response.data) == 0:
        raise ConflictError("Product is no longer available")

    return ProductsBaseSchema.model_validate(response.data[0])