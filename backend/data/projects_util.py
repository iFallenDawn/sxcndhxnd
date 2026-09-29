from entities.models import ProjectsBaseSchema, ProjectsInsert, ProjectsUpdate, ProductsBaseSchema
from supabasedb.supabase import db, scoped_client
from core.exceptions import NotFoundError
from pydantic import UUID4
from datetime import datetime, timezone

supabase = db()

async def get_all_projects() -> list[ProjectsBaseSchema]:
    query = supabase.table('projects').select('*').order('created_at', desc=True)
    response = query.execute()
    return [ProjectsBaseSchema.model_validate(row) for row in response.data]

async def get_project_by_id(project_id: UUID4) -> ProjectsBaseSchema:
    query = supabase.table('projects').select('*').eq('id', str(project_id))
    response = query.execute()

    if len(response.data) == 0:
        raise NotFoundError('Project', project_id)

    return ProjectsBaseSchema.model_validate(response.data[0])

async def create_project(payload: ProjectsInsert) -> ProjectsBaseSchema:
    new_project = payload.model_dump(mode='json', exclude_unset=True)
    new_project['id'] = str(payload.id)

    query = supabase.table('projects').insert(new_project)
    response = query.execute()

    if len(response.data) == 0:
        raise NotFoundError('Project', payload.id)

    return ProjectsBaseSchema.model_validate(response.data[0])

async def update_project(project_id: UUID4, payload: ProjectsUpdate) -> ProjectsBaseSchema:
    updated_project = payload.model_dump(mode='json', exclude_unset=True)
    updated_project['updated_at'] = datetime.now(timezone.utc).isoformat()

    query = supabase.table('projects').update(updated_project).eq('id', str(project_id))
    response = query.execute()

    if len(response.data) == 0:
        raise NotFoundError('Project', project_id)

    return ProjectsBaseSchema.model_validate(response.data[0])

async def delete_project(project_id: UUID4, access_token: str) -> ProjectsBaseSchema:
    client = scoped_client()
    client.postgrest.auth(access_token)

    # products.project_id is ON DELETE SET NULL, so its products become standalone
    query = client.table('projects').delete().eq('id', str(project_id))
    response = query.execute()

    if len(response.data) == 0:
        raise NotFoundError('Project', project_id)

    return ProjectsBaseSchema.model_validate(response.data[0])

async def get_products_by_project_id(project_id: UUID4) -> list[ProductsBaseSchema]:
    # 404 on an unknown project instead of returning an empty list
    await get_project_by_id(project_id)

    query = (
        supabase.table('products')
            .select('*')
            .eq('project_id', str(project_id))
            .order('created_at', desc=True)
    )
    response = query.execute()
    return [ProductsBaseSchema.model_validate(row) for row in response.data]
