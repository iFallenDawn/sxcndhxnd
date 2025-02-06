from ..firebase import app, db
from ..models.models import UserIn, UserOut
from fastapi import HTTPException
from firebase_admin import auth
from google.cloud.firestore_v1.base_query import FieldFilter

firestore_db = db(app)
users_collection = firestore_db.collection('users')

async def get_all_users() -> list[UserOut]:
    users = users_collection.stream()
    users_data = []
    for user in users:
        users_data.append({'id': user.id, **user.to_dict()})
    return users_data

async def get_user_by_id(user_id: str) -> UserOut:
    doc_ref = users_collection.document(user_id)
    user = doc_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail=f'User with id {user_id}not found')
    return {'id': doc_ref.id, **user.to_dict()}

# note, document is only used to reference by ID, so we have to use where to query
async def get_user_by_email(user_email: str) -> UserOut:
    users = users_collection.where(filter=FieldFilter("email", "==", user_email)).get()
    if len(users) != 1:
        raise HTTPException(status_code=404, detail=f'User with email {user_email} not found')
    user = users[0]
    return {'id': user.id, **user.to_dict()}

async def create_user(user_model: UserIn) -> UserOut:
    return None

async def update_user_email(user_id: str, new_email: str):
    return None

async def update_user_put(user_model: UserIn) -> UserOut:
    return None

async def update_user_patch(user_model: UserIn) -> UserOut:
    return None

async def delete_user(user_id: str) -> UserOut:
    return None

