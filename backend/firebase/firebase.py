import firebase_admin

from firebase_admin import credentials, App

cred = credentials.Certificate("sxcndhxnd-service-account.json")
app = firebase_admin.initialize_app(cred)

