import firebase_admin

from firebase_admin import credentials, App

def initialize_app() -> App:
    cred = credentials.Certificate("sxcndhxnd-service-account.json")
    return firebase_admin.initialize_app(cred)

