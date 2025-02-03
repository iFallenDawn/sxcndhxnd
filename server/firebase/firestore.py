from .firebase import initialize_app
from firebase_admin import firestore
from google.cloud.firestore.Firestore import Client

def db() -> Client:
    app = initialize_app()
    return firestore.client(app)