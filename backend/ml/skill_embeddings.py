from sentence_transformers import SentenceTransformer, util

# Load once (VERY IMPORTANT)
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_similarity(user_skills, market_skills):
    if not user_skills or not market_skills:
        return 0.0

    user_text = " ".join(user_skills)
    market_text = " ".join(market_skills)

    user_vec = model.encode(user_text, convert_to_tensor=True)
    market_vec = model.encode(market_text, convert_to_tensor=True)

    similarity = util.cos_sim(user_vec, market_vec)

    return round(float(similarity.item()) * 100, 2)
