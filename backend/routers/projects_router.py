from fastapi import APIRouter, Depends
from pydantic import UUID4
from data import projects_util
from entities.models import ProjectsBaseSchema, ProjectsInsert, ProjectsUpdate, ProductsBaseSchema
from core.auth import require_admin, get_access_token

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}}
)

@router.get("/")
async def get_all_projects() -> list[ProjectsBaseSchema]:
    return await projects_util.get_all_projects()

@router.get("/{project_id}")
async def get_project_by_id(project_id: UUID4) -> ProjectsBaseSchema:
    return await projects_util.get_project_by_id(project_id)

@router.post("/")
async def create_project(
    payload: ProjectsInsert,
    _: UUID4 = Depends(require_admin),
) -> ProjectsBaseSchema:
    return await projects_util.create_project(payload)

@router.patch("/{project_id}")
async def update_project(
    project_id: UUID4,
    payload: ProjectsUpdate,
    _: UUID4 = Depends(require_admin),
) -> ProjectsBaseSchema:
    return await projects_util.update_project(project_id, payload)

@router.delete("/{project_id}")
async def delete_project(
    project_id: UUID4,
    access_token: str = Depends(get_access_token),
    _: UUID4 = Depends(require_admin),
) -> ProjectsBaseSchema:
    return await projects_util.delete_project(project_id, access_token)

@router.get("/{project_id}/products")
async def get_products_by_project_id(project_id: UUID4) -> list[ProductsBaseSchema]:
    return await projects_util.get_products_by_project_id(project_id)