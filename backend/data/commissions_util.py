from ..firebase import app, db
from fastapi import HTTPException
from ..models.models import CommissionOut, CommissionIn

firestore_db = db(app)
commissions_collection = firestore_db.collection('commissions')

async def get_all_commissions() -> list[CommissionOut]:
    commissions = commissions_collection.stream()
    commissions_data = []
    for commission in commissions:
        # ** is unpacking (spread) operator
        commissions_data.append({'id': commission.id, **commission.to_dict()})
    return commissions_data

async def get_commission_by_id(commission_id: str) -> CommissionOut:
    doc_ref = commissions_collection.document(commission_id)
    commission = doc_ref.get()
    if not commission.exists:
        raise HTTPException(status_code=404, detail=f'Commission with id {commission_id}not found')
    return {'id': doc_ref.id, **commission.to_dict()}

# https://firebase.google.com/docs/firestore/manage-data/add-data
async def create_commission(commission_model: CommissionIn) -> CommissionOut:
    update_time, doc_ref = commissions_collection.add(commission_model.model_dump())
    if not doc_ref.get().exists:
        raise HTTPException(status_code=400, detail=f'Failed to create commission')
    return await get_commission_by_id(doc_ref.id)