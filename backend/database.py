import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

STUDENTS_COLLECTION = os.getenv("COLLECTION")  # students collection name
USERS_COLLECTION = os.getenv("USERS_COLLECTION", "users")  # default users

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

students_collection = db[STUDENTS_COLLECTION]
users_collection = db[USERS_COLLECTION]
