from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Lightweight, fast model
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_skills(skills):
    """
    Converts skill list into vector embeddings
    """
    return model.encode(skills)

def calculate_similarity(user_skills, market_skills):
    """
    Returns similarity score between user and market skills
    """
    user_vec = embed_skills(user_skills)
    market_vec = embed_skills(list(market_skills.keys()))

    similarity_matrix = cosine_similarity(user_vec, market_vec)

    # Average similarity score
    return round(similarity_matrix.mean() * 100, 2)
