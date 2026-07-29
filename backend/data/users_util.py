from entities.fastapi.schema_public_latest import Users
from supabasedb.supabase import db
from datetime import datetime

supabase = db()

async def get_user_by_id (
    user_id: str
) -> list: 
    query = supabase.table('users').select('*').eq('id', user_id)
    response = query.execute()
    return response.data