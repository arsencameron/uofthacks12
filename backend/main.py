from fastapi import FastAPI, HTTPException
from models import Review
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://uofthacks:babi@cluster0.mongodb.net/location_table?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client["accessibility_app"]
reviews_collection = db["reviews"]
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Home Page"}

@app.get("/reviews")
async def add_review(review: Review):
    location = await db["locations"].find_one({"_id": review.location_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Insert review into MongoDB
    review_dict = review.model_dump()
    review_dict["_id"] = str(await reviews_collection.count_documents({}) + 1)  # Generate unique ID
    await reviews_collection.insert_one(review_dict)

    return {"message": "Review added successfully", "review_id": review_dict["_id"]}

