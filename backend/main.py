from fastapi import FastAPI, HTTPException
from databases import Database
from models import Review, Location
from datetime import datetime
import httpx

# Supabase PostgreSQL connection
DATABASE_URL = "postgresql://<username>:<password>@<host>:<port>/<database>"
database = Database(DATABASE_URL)

# Define lifespan event handlers
async def lifespan(app: FastAPI):
    # Startup logic
    await database.connect()
    yield
    # Shutdown logic
    await database.disconnect()

# Create FastAPI app with lifespan middleware
app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Home Page"}

@app.post("/reviews")
async def add_review(review: Review):
    # Step 1: Check if the location exists
    location_query = "SELECT * FROM locations WHERE id = :location_id"
    location = await database.fetch_one(location_query, values={"location_id": review.location_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Step 2: Insert review into the database
    review_id = f"review_{int(datetime.utcnow().timestamp())}"  # Generate unique ID
    review_data = {
        "id": review_id,
        "text": review.text,
        "location_id": review.location_id,
        "user_id": review.user_id,
        "accessibility_ratings": review.accessibility_ratings.dict(),
        "timestamp": datetime.utcnow(),
    }
    insert_query = """
    INSERT INTO reviews (id, text, location_id, user_id, accessibility_ratings, timestamp)
    VALUES (:id, :text, :location_id, :user_id, :accessibility_ratings, :timestamp)
    """
    await database.execute(insert_query, values=review_data)

    # Step 3: Update the list of reviews for the location
    reviews = location["reviews"] or []
    reviews.append(review_id)

    # Step 4: Fetch all review texts for the location
    all_reviews_query = "SELECT text FROM reviews WHERE location_id = :location_id"
    all_reviews = await database.fetch_all(all_reviews_query, values={"location_id": review.location_id})
    review_texts = [review["text"] for review in all_reviews]

    # Step 5: Generate a new summary using the Gemini API
    summary = await generate_summary_with_gemini(review_texts)

    # Step 6: Update the location's reviews list and summary
    update_query = """
    UPDATE locations
    SET reviews = :reviews, summary = :summary
    WHERE id = :location_id
    """
    await database.execute(update_query, values={"reviews": reviews, "summary": summary, "location_id": review.location_id})

    return {"message": "Review added successfully", "review_id": review_id}

@app.get("/reviews/{review_id}", response_model=Review)
async def get_review(review_id: str):
    """
    Fetch a specific review by its ID.
    """
    # Query the reviews table for the given review_id
    review_query = "SELECT * FROM reviews WHERE id = :review_id"
    review = await database.fetch_one(review_query, values={"review_id": review_id})

    # If the review is not found, raise a 404 error
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Return the review as a Pydantic model
    return Review(**review)

@app.get("/locations/{location_id}", response_model=Location)
async def get_location(location_id: str):
    # Step 1: Fetch location details
    location_query = "SELECT * FROM locations WHERE id = :location_id"
    location = await database.fetch_one(location_query, values={"location_id": location_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Step 2: Fetch associated reviews
    reviews_query = "SELECT * FROM reviews WHERE location_id = :location_id"
    reviews = await database.fetch_all(reviews_query, values={"location_id": location_id})

    # Step 3: Convert reviews to Pydantic models
    reviews_list = [Review(**review) for review in reviews]

    # Step 4: Combine location details and reviews
    location_data = {
        "id": location["id"],
        "name": location["name"],
        "description": location["description"],
        "gps": location["gps"],
        "average_rating": location["average_rating"],
        "tags": location["tags"],
        "summary": location["summary"],
        "reviews": reviews_list,
    }

    return Location(**location_data)

async def generate_summary_with_gemini(review_texts: list[str]) -> str:
    """
    Calls the Gemini API to generate a summary based on the review texts.
    """
    api_url = "https://api.gemini.ai/generate-summary"
    headers = {
        "Authorization": "Bearer <your_gemini_api_key>",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": review_texts,
        "parameters": {
            "summary_length": "medium",
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(api_url, headers=headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to generate summary")

    return response.json().get("summary", "")