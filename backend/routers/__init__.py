from fastapi import APIRouter

from .auth import router as auth_router
from .commissions import router as commissions_router
# from .products import router as products_router
from .users import router as users_router

router = APIRouter(prefix='/api')
router.include_router(auth_router)
router.include_router(commissions_router)
# router.include_router(products_router)
router.include_router(users_router)