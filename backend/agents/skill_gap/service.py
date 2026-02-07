def find_skill_gap(user_skills: list):
    """
    Compare user skills with industry-required skills
    """

    # ✅ Core industry skills (static, realistic)
    INDUSTRY_SKILLS = [
        "Python",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Data Structures",
        "Git",
        "Docker",
        "Cloud Computing",
        "Statistics",
        "Airflow",
        "Spark"
    ]

    user_skill_set = set(skill.lower() for skill in user_skills)
    industry_skill_set = set(skill.lower() for skill in INDUSTRY_SKILLS)

    missing = industry_skill_set - user_skill_set

    return {
        "missing_skills": sorted([skill.title() for skill in missing]),
        "gap_count": len(missing)
    }
