# SEEEEEEEEEEEEEED
from .firebase import app 
from .firestore import db
from models.models import UserIn, UserOut
from firebase_admin import auth

firestore_db = db(app)
users_collection = firestore_db.collection('users')

def delete_if_exists(id: str, collection_name: str):
    named_collection = firestore_db.collection(collection_name)
    doc_ref = named_collection.document(id)
    item = doc_ref.get()
    if item.exists:        
        doc_ref.delete()
        print(f'Deleted item from Firestore collection with id {id}')
    if collection_name == 'users':
        try: 
            auth.delete_user(id)
            print(f'Deleted user with id {id} from Firebase auth')
        except Exception:
            pass

def add_empty_user(user_id: str):
    delete_if_exists(user_id, 'users')
    empty_user_data = {
        'firstName': "Nixon",
        'lastName': "Puertollano",
        'password': 'Password123!',
        'email': 'ncdaking123@gmail.com',
        'instagram': 'massivencdaking69',
        'commission_ids': [],
        'product_ids': []
    }
    validation_check = UserIn(**empty_user_data)
    # we use document and set because we're just gonna have set ids for our sample data
    print("...Adding empty user...")
    auth.create_user(uid=user_id, email=empty_user_data['email'], password=empty_user_data['password'])
    del empty_user_data['password']
    users_collection.document(user_id).set(empty_user_data)
    
def seed():
    print('Seeding database')
    add_empty_user('1')
    print('Success!')
    
seed()