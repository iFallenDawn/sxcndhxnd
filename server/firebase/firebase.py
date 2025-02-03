import firebase_admin

from firebase_admin import credentials

def initialize_app():
    cred = credentials.Certificate("sxcndhxnd-service-account.json")
    firebase_admin.initialize_app(cred)

initialize_app()