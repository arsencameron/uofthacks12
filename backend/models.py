from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Review model for input validation

class AccessibilityRatings(BaseModel):
    physical: int = Field(..., title="Physical Accessibility Rating", ge=1, le=5)
    visual: int = Field(..., title="Visual Accessibility Rating", ge=1, le=5)
    auditory: int = Field(..., title="Auditory Accessibility Rating", ge=1, le=5)
    cognitive: int = Field(..., title="Cognitive Accessibility Rating", ge=1, le=5)

class Review(BaseModel):
    text: str = Field(..., title="Review Text", max_length=1000)
    location_id: str = Field(..., title="Location ID")
    user_id: str = Field(..., title="User ID")
    accessibility_ratings: AccessibilityRatings = Field(
        title="Detailed Accessibility Ratings"
    )
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow, title="Timestamp")

# User model for managing user-related data
class User(BaseModel):
    id: str = Field(..., title="User ID")
    name: Optional[str] = Field(None, title="Name")
    email: Optional[str] = Field(None, title="Email")
    preferences: Optional[List[str]] = Field(None, title="User Preferences")

# Location model for defining locations
class Location(BaseModel):
    id: str = Field(..., title="Location ID")
    name: str = Field(..., title="Location Name", max_length=200)
    description: Optional[str] = Field(None, title="Description")
    gps: Optional[dict] = Field(None, title="GPS Coordinates")
    average_rating: Optional[float] = Field(None, title="Average Rating", ge=0, le=5)
    tags: Optional[List[str]] = Field(None, title="Tags")
    summary: Optional[str] = Field(None, title="Summary")
    reviews: Optional[List[Review]] = Field(None, title="List of Reviews")  # New field



