from sentence_transformers import SentenceTransformer
import os

MODEL_NAME = "all-MiniLM-L6-v2"

def load_model():
    try:
        print("🔹 Loading embedding model...")
        return SentenceTransformer(MODEL_NAME)
    except Exception as e:
        print("❌ Model load failed:", e)
        return None

model = load_model()

def embed_skills(skills: list):
    """
    Convert skills to embeddings.
    Fallback if model not available.
    """
    if not model or not skills:
        # fallback dummy vectors
        return [[0.0] * 384 for _ in skills]

    return model.encode(skills)
