from ..firebase.firestore import db
from fastapi import HTTPException
from ..models.models import Commission

firestore_db = db()
commissions_collection = firestore_db.collection('commissions')

async def get_all_commissions() -> dict:
    commissions = commissions_collection.stream()
    commissions_data = []
    for commission in commissions:
        # ** is unpacking (spread) operator
        commissions_data.append({'id': commission.id, **commission.to_dict()})
    return commissions_data

async def get_commission_by_id(commission_id: str) -> dict:
    doc_ref = commissions_collection.document(commission_id)
    commission = doc_ref.get()
    if not commission.exists:
        raise HTTPException(status_code=404, detail=f'Commission with id {commission_id} not found')
    return {'id': doc_ref.id, **commission.to_dict()}

# https://firebase.google.com/docs/firestore/manage-data/add-data
async def create_commission(commission_model: Commission) -> dict:
    update_time, doc_ref = commissions_collection.add(commission_model.model_dump())
    return await get_commission_by_id(doc_ref.id)