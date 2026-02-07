def ml_job_match(user_skills, market_skills):
    """
    Fallback ML matcher when embeddings are unavailable
    """
    if not user_skills or not market_skills:
        return {
            "match_percentage": 0,
            "reason": "Insufficient data"
        }

    overlap = set(user_skills).intersection(set(market_skills))
    score = round((len(overlap) / len(market_skills)) * 100, 2)

    return {
        "match_percentage": score,
        "method": "rule-based (offline-safe)"
    }
