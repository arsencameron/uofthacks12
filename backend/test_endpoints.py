import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_add_location():
    url = f"{BASE_URL}/add-location"
    data = {
        "name": "Central Park",
        "description": "A large urban park in New York City",
        "tags": ["park", "outdoors", "nature"],
        "summary": "Beautiful park in the heart of Manhattan",
        "embedding": [0.1, 0.2, 0.3, 0.4]
    }
    response = requests.post(url, json=data)
    print("Add Location Response:", response.status_code)
    print(response.json())

def test_add_review():
    url = f"{BASE_URL}/add-review"
    data = {
        "user_id": "user789",
        "accessibility_ratings": {
            "wheelchair": 4,
            "vision": 3,
            "hearing": 5
        },
        "timestamp": "2023-05-15T14:30:00Z"
    }
    response = requests.post(url, json=data)
    print("Add Review Response:", response.status_code)
    print(response.json())

if __name__ == "__main__":
    test_add_location()
    test_add_review()
