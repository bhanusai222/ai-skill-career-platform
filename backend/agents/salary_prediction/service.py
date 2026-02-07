def predict_salary(
    primary_domain: str,
    skill_count: int,
    experience_years: int,
    remote: bool = False
):
    """
    Realistic salary prediction for India (LPA)
    """

    base_salary = {
        "AI": 6.5,
        "Data": 6.0,
        "Programming": 5.5,
        "Database": 5.5,
        "General": 4.5
    }.get(primary_domain, 4.5)

    # Skill impact
    base_salary += min(skill_count * 0.4, 4)

    # Experience impact
    base_salary += min(experience_years * 0.8, 6)

    # Remote bonus
    if remote:
        base_salary += 1.5

    min_lpa = round(base_salary - 1.5, 1)
    max_lpa = round(base_salary + 2.5, 1)

    return {
        "min_lpa": max(min_lpa, 3.5),
        "max_lpa": max(max_lpa, min_lpa + 1),
        "currency": "INR",
        "unit": "LPA",
        "confidence": "Estimated based on market trends"
    }
