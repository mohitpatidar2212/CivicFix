# db.py - MongoDB connection (motor async)
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.civicfix_db

# Collections
users_col = db["users"]
reports_col = db["reports"]
notifications_col = db["notifications"]
