from ..firebase import app, db
from ..models.models import UserIn, UserOut
from fastapi import HTTPException
from firebase_admin import auth
from firebase_admin.auth import UserRecord
from google.cloud.firestore_v1.base_query import FieldFilter

firestore_db = db(app)
users_collection = firestore_db.collection('users')

async def get_all_users() -> list[UserOut]:
    users = users_collection.stream()
    users_data = []
    for user in users:
        user_data = {'id': user.id, **user.to_dict()}
        users_data.append(UserOut(**user_data))
    return users_data

async def get_user_by_id(user_id: str) -> UserOut:
    doc_ref = users_collection.document(user_id)
    user = doc_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail=f'User with id {user_id}not found')
    user_data = {'id': doc_ref.id, **user.to_dict()}
    return UserOut(**user_data)

# note, document is only used to reference by ID, so we have to use where to query
async def get_user_by_email(user_email: str) -> UserOut:
    users = users_collection.where(filter=FieldFilter("email", "==", user_email)).get()
    if len(users) != 1:
        raise HTTPException(status_code=404, detail=f'User with email {user_email} not found')
    user = users[0]
    user_data = {'id': user.id, **user.to_dict()}
    return UserOut(**user_data)

# gets the UserRecord from firebase auth, not firestore
async def get_user_by_id_auth(user_id: str) -> UserRecord:
    user = {}
    try:
        user = auth.get_user(user_id)
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail=f'User with id {user_id}does not exist in Firebase Auth')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'{e}')
    return user

async def create_user(user_model: UserIn) -> UserOut:
    user = {}
    # create in firebase auth
    try:
        user = auth.create_user(email=user_model.email, password=user_model.password)
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail=f'User with email {user_model.email} already exists')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'{e}')
    user_id = user.uid
    # update user collection
    users_collection.add(document_data=user_model.model_dump(), document_id=user_id)
    return await get_user_by_id(user_id)

# return UserOut with updated new_user fields
async def compare_user_models(old_user: dict, new_user: dict) -> UserOut:
    user_out = old_user
    for key, value in new_user.items():
        # these are lists
        if key == 'commission_ids' or key == 'product_ids':
            user_out[key].extend(value)
        elif key in old_user.keys() and old_user[key] != value:
            user_out[key] = value
    return UserOut(**user_out)

# put replaces the item
async def update_user_put(user_id: str, new_user_model: UserIn) -> UserOut:
    # check the user exists
    old_user_model = await get_user_by_id(user_id)
    await get_user_by_id_auth(user_id)
    # check if we can update firebase auth first before updating user collection
    try:
        auth.update_user(user_id, email=new_user_model.email, password=new_user_model.password)
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail=f'User with email {new_user_model.email} already exists')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'{e}')
    updated_user_data = await compare_user_models(old_user_model.model_dump(), new_user_model.model_dump())
    users_collection.document(user_id).set(updated_user_data.model_dump())
    return await get_user_by_id(user_id)

async def update_user_patch(user_id: str, new_user_model: dict) -> UserOut:
    if 'firstName' in new_user_model.keys():
        new_user_model['first_name'] = new_user_model['firstName']
    if 'lastName' in new_user_model.keys():
        new_user_model['last_name'] = new_user_model['lastName']
    # check the user exists
    old_user_model = await get_user_by_id(user_id)
    updated_user_data = await compare_user_models(old_user_model.model_dump(), new_user_model)
    users_collection.document(user_id).update(updated_user_data.model_dump())
    return await get_user_by_id(user_id)

async def delete_user(user_id: str) -> UserOut:
    # check user exists
    deleted_user = await get_user_by_id(user_id)
    await get_user_by_id_auth(user_id)
    try:
        auth.delete_user(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'{e}')
    auth.delete_user(user_id)
    users_collection.document(user_id).delete()
    return deleted_user

