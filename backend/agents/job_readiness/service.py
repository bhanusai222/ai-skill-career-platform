from ml.skill_embeddings import get_similarity

def check_job_readiness(user_skills, market_skills):
    score = get_similarity(user_skills, market_skills)

    status = "Not Ready"
    if score > 70:
        status = "Ready"
    elif score > 50:
        status = "Almost Ready"

    return {
        "match_score": score,
        "status": status
    }
