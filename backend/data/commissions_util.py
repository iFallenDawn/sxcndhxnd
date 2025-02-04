from ..firebase.firestore import db
from fastapi import HTTPException
from ..models import commission_model

firestore_db = db()

async def get_all_commissions() -> dict:
    commissions_collection = firestore_db.collection('commissions')
    commissions = commissions_collection.stream()
    commissions_data = []
    for commission in commissions:
        # ** is unpacking (spread) operator
        commissions_data.append({'id': commission.id, **commission.to_dict()})
    return commissions_data

async def get_commission_by_id(id: str) -> dict:
    commissions_collection = firestore_db.collection('commissions')
    docRef = commissions_collection.document(id)
    commission = docRef.get()
    if not commission.exists:
        raise HTTPException(status_code=404, detail=f'Commission with id {id} not found')
    return commission.to_dict()
