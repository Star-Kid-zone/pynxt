# app/db/mongo.py

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

MONGO_URI = settings.MONGO_URL
DATABASE_NAME = settings.DATABASE_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]  # ✅ THIS is what you're trying to import
