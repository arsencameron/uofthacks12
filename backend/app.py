from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.accessibility_db

@app.get("/locations")
async def get_locations():
    locations = await db.locations.find().to_list(100)
    return locations