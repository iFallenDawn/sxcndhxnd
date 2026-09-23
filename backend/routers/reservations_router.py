from fastapi import APIRouter, Depends, UploadFile, Request
from pydantic import UUID4
from data import reservations_util
from entities.models import ReservationsUpdate, ReservationsBaseSchema
from core.auth import require_admin, get_access_token, get_current_user_id
from core.rate_limit import limiter


router = APIRouter(
    prefix="/reservations",
    tags=["reservations"],
    responses={404: {"description": "Not found"}}
)

@router.get("/me")
async def get_my_reservations(
    access_token: str = Depends(get_access_token),
    current_user_id: UUID4 = Depends(get_current_user_id)
) -> list[ReservationsBaseSchema]:
    return await reservations_util.get_my_reservations(current_user_id, access_token)

@router.get("/")
async def get_all_reservations(
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> list[ReservationsBaseSchema]:
    return await reservations_util.get_all_reservations(access_token)

@router.get("/{reservation_id}")
async def get_reservation_by_id(
    reservation_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> ReservationsBaseSchema:
    return await reservations_util.get_reservation_by_id(reservation_id, access_token)

@router.delete("/{reservation_id}")
async def delete_reservation(
    reservation_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> ReservationsBaseSchema:
    return await reservations_util.delete_reservation(reservation_id, access_token)

@router.patch("/{reservation_id}")
async def update_reservation(
    reservation_id: UUID4,
    payload: ReservationsUpdate,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin)
) -> ReservationsBaseSchema:
    return await reservations_util.update_reservation(reservation_id, payload, access_token)