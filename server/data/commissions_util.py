from ..firebase.firestore import db

async def get_commission_by_id(id: str):
    return db