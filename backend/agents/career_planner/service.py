def recommend_career(user, gap):
    domain = user.get("primary_domain", "General")

    if domain == "AI":
        return {
            "role": "Machine Learning Engineer",
            "timeline": "6–9 months",
            "risk": "High learning curve, high reward"
        }

    if domain == "Data":
        return {
            "role": "Data Engineer",
            "timeline": "3–6 months",
            "risk": "Moderate"
        }

    return {
        "role": "Software Engineer",
        "timeline": "6 months",
        "risk": "Low"
    }
