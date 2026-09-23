from entities.models import ProductsBaseSchema, ReservationsBaseSchema, ReservationsUpdate
from supabasedb.supabase import db, scoped_client
from core.exceptions import NotFoundError, NoFieldsProvidedError, ConflictError
from pydantic import UUID4
from datetime import datetime, timezone
from data import products_util
from core.email import send_admin_reservation_notification, send_customer_reservation_notification
from typing import cast, Any
import logging
import os

NICO_EMAIL = os.environ.get("NICO_EMAIL") or ""

logger = logging.getLogger(__name__)
supabase = db()

async def get_all_reservations(access_token: str) -> list[ReservationsBaseSchema]:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = supabase.table('reservations').select()
    response = query.execute()
    result = [ReservationsBaseSchema.model_validate(row) for row in response.data]
    return result

async def get_reservation_by_id(
    reservation_id: UUID4,
    access_token: str
) -> ReservationsBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = supabase.table('reservations').select('*').eq('id', str(reservation_id))
    response = query.execute()
    
    if len(response.data) == 0:
        raise NotFoundError('Reservation', reservation_id)

    return ReservationsBaseSchema.model_validate(response.data[0])

async def get_my_reservations(
    current_user_id: UUID4,
    access_token: str
) -> list[ReservationsBaseSchema]:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    query = client.table('reservations').select('*').eq('user_id', str(current_user_id))
    response = query.execute()
    return [ReservationsBaseSchema.model_validate(row) for row in response.data]

async def create_reservation(
    product_id: UUID4,
    instagram: str,
    user_id: UUID4 | None,
    access_token: str | None,
) -> ProductsBaseSchema:
    product = await products_util.reserve_product(product_id)
    reservation = {
        "product_id": str(product_id),
        "instagram": instagram,
        "user_id": str(user_id) if user_id else None
    }
    query = supabase.table('reservations').insert(reservation)
    reservation_response = query.execute()
    if len(reservation_response.data) == 0:
        # revert if we can't insert a reservation
        logger.error(f"Failed to record reservation for product {product_id}, instagram={instagram}")
        supabase.table('products').update({"status": "available"}).eq('id', str(product_id)).execute()
        raise ConflictError("Reservation could not be completed, please try again")
    
    await send_admin_reservation_notification(product.title, instagram)
    
    if user_id is not None and access_token is not None:
        try:
            client = scoped_client()
            client.postgrest.auth(access_token)
            query = client.table('users').select('email').eq('id', str(user_id))
            user_response = query.execute()
            if user_response.data:
                row = cast(dict[str, Any], user_response.data[0])
                user_email = row['email']
                await send_customer_reservation_notification(user_email, product.title)
        except Exception as e:
            logger.error(f"Failed to send confirmation email to user {user_id} for product {product_id}: {e}")
    return product

async def update_reservation(
    reservation_id: UUID4,
    payload: ReservationsUpdate,
    access_token: str
) -> ReservationsBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    updated_fields = payload.model_dump(mode="json", exclude_unset=True)
    if not updated_fields:
        raise ValueError('No fields provided to update')
    
    query = client.table('reservations').update(updated_fields).eq('id', str(reservation_id))
    response = query.execute()
    if len(response.data) == 0:
        raise NoFieldsProvidedError()
    
    return ReservationsBaseSchema.model_validate(response.data[0])

async def delete_reservation(
    reservation_id: UUID4,
    access_token: str
) -> ReservationsBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)
    
    reservation = await get_reservation_by_id(reservation_id, access_token)   
    query = client.table('reservations').delete().eq('id', str(reservation_id))
    response = query.execute()
    if len(response.data) == 0:
        raise NotFoundError('Reservation', reservation_id)
    
    updated_product = {
        "status": "available",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        client.table('products').update(updated_product).eq('id', str(reservation.product_id)).eq('status', 'reserved').execute()
    except Exception as e:
        logger.error(f"Failed to revert product {reservation.product_id} to available after deleting reservation {reservation_id}: {e}")
        
    return reservation
    
    