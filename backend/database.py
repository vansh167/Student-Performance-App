import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
COLLECTION = os.getenv("COLLECTION")

# 1️⃣ Connect MongoDB
client = MongoClient(MONGO_URL)

# 2️⃣ Create database
db = client[DB_NAME]

# 3️⃣ Collections
students_collection = db[COLLECTION]
users_collection = db["users"]
resources_collection = db["resources"]   # ✅ now db exists
