def create_learning_plan(skill_gap: dict):
    """
    Create a prioritized learning plan from skill gap
    """

    missing_skills = skill_gap.get("missing_skills", [])

    plan = []

    for skill in missing_skills:
        plan.append({
            "skill": skill,
            "priority": "High",
            "estimated_time": "2–3 weeks"
        })

    return plan
