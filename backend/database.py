import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
COLLECTION = os.getenv("COLLECTION")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
students_collection = db[COLLECTION]
