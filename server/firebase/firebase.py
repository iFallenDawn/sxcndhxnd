import firebase_admin

from firebase_admin import credentials

def initialize_app():
    cred = credentials.Certificate("sxcndhxnd-service-account.json")
    return firebase_admin.initialize_app(cred)

