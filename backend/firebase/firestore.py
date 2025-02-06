from firebase_admin import firestore, App
from google.cloud.firestore import Client

def db(app: App) -> Client:
    return firestore.client(app)