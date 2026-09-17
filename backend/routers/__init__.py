from fastapi import APIRouter

from routers.users_router import router as users_router
from routers.auth_router import router as auth_router
from routers.products_router import router as product_router
from routers.admin_router import router as admin_router
from routers.gallery_router import router as gallery_router

router = APIRouter()

router.include_router(admin_router)
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(product_router)
router.include_router(gallery_router)