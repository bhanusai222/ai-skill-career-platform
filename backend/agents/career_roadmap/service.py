def generate_career_roadmap(career: dict, skill_gap: dict):
    """
    Generate a career roadmap based on role and missing skills
    """

    role = career.get("role", "Professional")
    missing_skills = skill_gap.get("missing_skills", [])

    roadmap = {
        "3_months": [],
        "6_months": [],
        "12_months": []
    }

    # ---- 3 MONTHS: Foundations ----
    for skill in missing_skills[:2]:
        roadmap["3_months"].append({
            "skill": skill,
            "goal": f"Learn fundamentals of {skill}",
            "courses": [
                {
                    "title": f"{skill} Fundamentals",
                    "platform": "Coursera",
                    "link": f"https://www.coursera.org/search?query={skill}"
                },
                {
                    "title": f"{skill} (NPTEL)",
                    "platform": "NPTEL",
                    "link": f"https://nptel.ac.in/courses/search?searchText={skill}"
                }
            ]
        })

    # ---- 6 MONTHS: Projects ----
    for skill in missing_skills[2:4]:
        roadmap["6_months"].append({
            "skill": skill,
            "goal": f"Build real-world projects using {skill}"
        })

    # ---- 12 MONTHS: Career Prep ----
    roadmap["12_months"] = [
        {"goal": f"Advanced projects for {role}"},
        {"goal": "Prepare interviews & apply for jobs"}
    ]

    return roadmap
