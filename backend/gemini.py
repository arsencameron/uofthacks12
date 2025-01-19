import google.generativeai as genai
import os
from dotenv import load_dotenv
import numpy as np
from typing import List, Tuple
load_dotenv()

key = os.getenv("gemini")
user = os.getenv("user")
print(key)
genai.configure(api_key=f"{key}")

def get_summary(reviews):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"Provide an exactly 100 word summary of all of these reviews: {reviews}")
    print(response.text)
    return response.text

def get_embedding(text):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=f"{text}")
    return result['embedding']

def cosine_similarity(vector1, vector2):
    dot_product = np.dot(vector1, vector2)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    return dot_product / (norm_vector1 * norm_vector2)

def get_sorted_locations(prompt_embedding: np.ndarray, summary_embeddings: List[Tuple[str, np.ndarray]]) -> List[Tuple[str, float]]:
    """
    Sort locations by similarity to the prompt embedding.

    Args:
        prompt_embedding (np.ndarray): The embedding of the user's prompt.
        summary_embeddings (List[Tuple[str, np.ndarray]]): A list of tuples containing location names and their embeddings.

    Returns:
        List[Tuple[str, float]]: A sorted list of locations and their similarity scores in descending order.
    """
    similarities = [
        (name, cosine_similarity(prompt_embedding, np.array(embedding)), location_id)
        for name, embedding, location_id in summary_embeddings
    ]

    # Sort by similarity in descending order
    sorted_locations = sorted(similarities, key=lambda x: x[1], reverse=True)
    return sorted_locations