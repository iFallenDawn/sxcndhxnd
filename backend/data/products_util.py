from entities.models import ProductsBaseSchema, ProductsInsert, ProductsUpdate
from supabasedb.supabase import db
from core.exceptions import NotFoundError, ConflictError, NoResourcesReturnedError
from pydantic import EmailStr, UUID4
from uuid import uuid4
from datetime import datetime, timezone

supabase = db()

async def get_all_products() -> list[ProductsBaseSchema]:
    query = supabase.table('products').select()
    response = query.execute()
    
    if len(response.data) == 0:
        raise NoResourcesReturnedError('products')
    
    result = [ProductsBaseSchema.model_validate(row) for row in response.data]
    return result

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