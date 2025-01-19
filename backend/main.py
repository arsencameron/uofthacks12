import psycopg2
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime
from gemini import get_summary, get_embedding, get_sorted_locations, check_same, add_tag
import numpy as np

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

try:
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME,
        gssencmode = 'disable',
    )
    print("Connection successful!")

    # Create a cursor to execute SQL queries
    cursor = connection.cursor()

    # Example query
    cursor.execute("SELECT NOW();")
    result = cursor.fetchone()
    print("Current Time:", result)

    # Close the cursor and connection
    cursor.close()
    connection.close()
    print("Connection closed.")


except Exception as e:
    print(f"Failed to connect: {e}")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_db_connection():
    """
    Establish a connection to the PostgreSQL database.
    """
    print(f"USER: {USER}, PASSWORD: {PASSWORD}, HOST: {HOST}, PORT: {PORT}, DBNAME: {DBNAME}")
    try:
        conn = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME,
            gssencmode = 'disable',
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route("/")
def query_review():
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM reviews")
        reviews = cursor.fetchall()
        return jsonify(reviews)
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        abort(500, description="Failed to fetch reviews")
    finally:
        cursor.close()
        conn.close()

@app.route("/locations")
def query_locations():
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM locations")
        locations = cursor.fetchall()
        return jsonify(locations)
    except Exception as e:
        print(f"Error fetching locations: {e}")
        abort(500, description="Failed to fetch locations")
    finally:
        cursor.close()
        conn.close()


@app.route("/locations_coordinate")
def query_locations_coordinate():
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT coordinates[1] as latitude, coordinates[2] as longitude, name FROM locations")
        locations = cursor.fetchall()
        return jsonify(locations)
    except Exception as e:
        print(f"Error fetching locations: {e}")
        abort(500, description="Failed to fetch locations")
    finally:
        cursor.close()
        conn.close()

@app.route("/reviews", methods=["POST"])
def add_review():
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")
    try: 
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON data")
        timestamp = f"review_{int(datetime.utcnow().timestamp())}"
        review = {
            "text": data.get("text"),
            "location_id": data.get("location_id"),
            "user_id": data.get("user_id"),
            "accessibility_ratings": data.get("accessibility_ratings"),
            "timestamp": datetime.utcnow(),
            "title": data.get("title")
        }
        cursor.execute(
            """
            INSERT INTO reviews (title, text, location_id, user_id, accessibility_ratings, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING review_id
            """,
            (review["title"], review["text"], review["location_id"], review["user_id"], json.dumps(review["accessibility_ratings"]), review["timestamp"]),
        )
        print("Success here")
        result = cursor.fetchone()
        print(result)
        if result:
            review_id = result['review_id']
            print(f"Review inserted successfully. review_id: {review_id}")

            new_tags = add_tag(review["text"])
            print(f"Generated tags: {new_tags}")

            # Fetch existing tags for the location
            cursor.execute(
                """
                SELECT tags
                FROM locations
                WHERE location_id = %s
                """,
                (review["location_id"],)
            )
            location_data = cursor.fetchone()
            existing_tags = location_data["tags"] if location_data and location_data["tags"] is not None else []
            print(f"Existing tags: {existing_tags}")

            # Merge new tags with existing ones (avoiding duplicates)
            updated_tags = list(set(existing_tags + new_tags))
            print(f"Updated tags: {updated_tags}")

            # Update the tags in the locations table
            cursor.execute(
                """
                UPDATE locations
                SET tags = COALESCE(tags, ARRAY[]::TEXT[]) || %s::TEXT[]
                WHERE location_id = %s
                """,
                (updated_tags, review["location_id"])
            )

            cursor.execute("""
            SELECT r.*
            FROM locations l
            JOIN reviews r ON r.review_id = ANY(l.review_ids)
            WHERE l.location_id = %s
            ORDER BY r.timestamp DESC;
            """, (review["location_id"],))
            reviews = cursor.fetchall()
            new_summary = get_summary(reviews)
            new_embedding = get_embedding(new_summary)
            # Add summary to current location
            # Assuming `new_summary` and `new_embedding` are already computed
            cursor.execute(
                """
                UPDATE locations
                SET summary = %s, embedding = %s
                WHERE location_id = %s
                """,
                (new_summary, new_embedding, review["location_id"])
            )

# Update locations table
            cursor.execute(
                    """
                    UPDATE locations 
                    SET review_ids = COALESCE(review_ids, ARRAY[]::uuid[]) || %s::uuid
                    WHERE location_id = %s
                    """,
                    (review_id, review["location_id"])
                )
            if cursor.rowcount > 0:
                print(f"Location updated successfully for location_id: {review['location_id']}")
            else:
                print(f"No location found with location_id: {review['location_id']}")
        else:
            print("Insert operation did not return a review_id")

        conn.commit()
        return jsonify({"message": "Review added successfully", "review_id": timestamp})


    except Exception as e:
        print(f"Error adding review: {e}")
        abort(500, description="Failed to add review")
    finally:
        cursor.close()
        conn.close()

@app.route("/locations/<location_id>", methods=["GET"])
def get_location_summary(location_id):
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT summary FROM locations WHERE location_id = %s", (location_id,))
        location = cursor.fetchone()
        if not location:
            abort(404, description="Location not found")
        return jsonify(location)
    except Exception as e:
        print(f"Error fetching location summary: {e}")
        abort(500, description="Failed to fetch location summary")
    finally:
        cursor.close()
        conn.close()


@app.route("/search", methods=["POST"])
def search():
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400

        user_prompt = data.get("prompt", "No prompt provided")
        prompt_embedding = get_embedding(user_prompt)

        cursor.execute("""
            SELECT l.name, l.embedding, l.location_id
            FROM locations l
            WHERE l.embedding IS NOT NULL
        """)
        summary_embeddings = cursor.fetchall()

        # Convert string embeddings to NumPy arrays
        valid_embeddings = []
        for entry in summary_embeddings:
            try:
                if isinstance(entry['embedding'], str):  # If it's JSON string, parse it
                    entry['embedding'] = np.array(json.loads(entry['embedding']))
                elif isinstance(entry['embedding'], list):  # Already a list, convert to array
                    entry['embedding'] = np.array(entry['embedding'])
                valid_embeddings.append((entry['name'], entry['embedding'], entry['location_id']))
            except Exception as e:
                print(f"Failed to process embedding for {entry['name']}: {e}")

        if not valid_embeddings:
            return jsonify({"error": "No valid embeddings found in database"}), 500

        sorted_locations = get_sorted_locations(prompt_embedding, [(entry['name'], entry['embedding'], entry['location_id']) for entry in summary_embeddings])
        return jsonify(sorted_locations)

    except Exception as e:
        print(f"Error searching locations: {e}")
        abort(500, description="Failed to search locations")
    finally:
        cursor.close()
        conn.close()


# @app.route("/")
# def home():
#     return jsonify({"message": "Welcome to the Flask API"})
# #
# #
# @app.route("/reviews", methods=["POST"])
# def add_review():
#     """
#     Add a new review and update the associated location's review list.
#     """
#     data = request.get_json()
#     if not data:
#         abort(400, description="Invalid JSON data")

#     review_id = f"review_{int(datetime.utcnow().timestamp())}"
#     review = {
#         "text": data.get("text"),
#         "location_id": data.get("location_id"),
#         "user_id": data.get("user_id"),
#         "accessibility_ratings": data.get("accessibility_ratings"),
#         "timestamp": datetime.utcnow(),
#     }

#     conn = get_db_connection()
#     if not conn:
#         abort(500, description="Database connection failed")

#     try:
#         cursor = conn.cursor(cursor_factory=RealDictCursor)

#         # Check if the location exists
#         cursor.execute("SELECT * FROM locations WHERE location_id = %s", (review["location_id"],))
#         location = cursor.fetchone()
#         if not location:
#             abort(404, description="Location not found")

#         # Insert the review into the reviews table
#         cursor.execute(
#             """
#             INSERT INTO reviews (id, text, location_id, user_id, accessibility_ratings, timestamp)
#             VALUES (%s, %s, %s, %s, %s, %s)
#             """,
#             (review["id"], review["text"], review["location_id"], review["user_id"],
#              json.dumps(review["accessibility_ratings"]), review["timestamp"]),
#         )

#         # Update the location's reviews list
#         reviews = location.get("reviews") or []
#         reviews.append(review["id"])
#         cursor.execute(
#             "UPDATE locations SET reviews = %s WHERE id = %s",
#             (json.dumps(reviews), review["location_id"]),
#         )

#         conn.commit()
#         return jsonify({"message": "Review added successfully", "review_id": review_id})
#     except Exception as e:
#         print(f"Error adding review: {e}")
#         abort(500, description="Failed to add review")
#     finally:
#         cursor.close()
#         conn.close()

#
# @app.route("/locations/<location_id>", methods=["GET"])
# def get_location(location_id):
#     """
#     Get detailed information about a specific location, including reviews.
#     """
#     conn = get_db_connection()
#     if not conn:
#         abort(500, description="Database connection failed")
#
#     try:
#         cursor = conn.cursor(cursor_factory=RealDictCursor)
#
#         # Fetch the location details
#         cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
#         location = cursor.fetchone()
#         if not location:
#             abort(404, description="Location not found")
#
#         # Fetch associated reviews
#         cursor.execute("SELECT * FROM reviews WHERE location_id = %s", (location_id,))
#         reviews = cursor.fetchall()
#
#         location["reviews"] = reviews
#         return jsonify(location)
#     except Exception as e:
#         print(f"Error fetching location: {e}")
#         abort(500, description="Failed to fetch location")
#     finally:
#         cursor.close()
#         conn.close()
#
#
@app.route("/reviews/<review_id>", methods=["GET"])
def get_review(review_id):
    """
    Get details of a specific review by its ID.
    """
    conn = get_db_connection()
    if not conn:
        abort(500, description="Database connection failed")

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Fetch the review details
        cursor.execute("SELECT * FROM reviews WHERE review_id = %s", (review_id,))
        review = cursor.fetchone()
        if not review:
            abort(404, description="Review not found")
        return jsonify(review)
    except Exception as e:
        print(f"Error fetching review: {e}")
        abort(500, description="Failed to fetch review")
    finally:
        cursor.close()
        conn.close()
#
#
if __name__ == "__main__":
    app.run(debug=True)
    conn = get_db_connection()



