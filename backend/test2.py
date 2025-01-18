from flask import Flask, request, jsonify
from psycopg2 import connect, sql
from psycopg2.extras import Json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Fetch database configuration
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Create Flask app
app = Flask(__name__)

# Database connection function
def get_db_connection():
    return connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )

# Endpoint to add a location
@app.route('/add-location', methods=['POST'])
def add_location():
    data = request.json
    required_fields = ['location_id', 'name', 'description', 'tags', 'summary', 'embedding']
    
    # Validate required fields
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    # Insert location into the database
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO locations (location_id, name, description, review_ids, tags, summary, embedding)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            data['location_id'], 
            data['name'], 
            data['description'], 
            Json([]),  # Default empty list for reviews
            Json(data['tags']), 
            data['summary'], 
            Json(data['embedding'])
        ))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Location added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to add a review
@app.route('/add-review', methods=['POST'])
def add_review():
    data = request.json
    required_fields = ['review_id', 'location_id', 'user_id', 'accessibility_ratings', 'timestamp']
    
    # Validate required fields
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    # Insert review into the database
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Step 1: Check if the location exists
        cursor.execute("SELECT review_ids FROM locations WHERE location_id = %s", (data['location_id'],))
        location = cursor.fetchone()
        if not location:
            return jsonify({"error": "Location not found"}), 404

        # Step 2: Insert the review
        insert_query = """
            INSERT INTO reviews (review_id, location_id, user_id, accessibility_ratings, timestamp)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            data['review_id'], 
            data['location_id'], 
            data['user_id'], 
            Json(data['accessibility_ratings']), 
            data['timestamp']
        ))
        connection.commit()

        # Step 3: Update the location's review_ids
        review_ids = location[0] or []
        review_ids.append(data['review_id'])
        update_query = "UPDATE locations SET review_ids = %s WHERE location_id = %s"
        cursor.execute(update_query, (Json(review_ids), data['location_id']))
        connection.commit()

        cursor.close()
        connection.close()
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)