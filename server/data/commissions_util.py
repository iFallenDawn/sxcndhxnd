from ..firebase.firestore import db
from fastapi import HTTPException

firestore_db = db()

async def getAllCommissions() -> dict:
    return {}

async def get_commission_by_id(id: str) -> dict:
    commissions = firestore_db.collection('commissions')
    print(id)
    docRef = commissions.document(id)
    commission = docRef.get()
    if not commission.exists:
        raise HTTPException(status_code=404, detail=f'Commission with id {id} not found')
    return commission.to_dict()
