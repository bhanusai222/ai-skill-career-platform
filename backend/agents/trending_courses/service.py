def get_trending_courses(missing_skills, role):
    courses = []

    for skill in missing_skills:
        courses.append({
            "skill": skill,
            "recommended_courses": [
                {
                    "title": f"{skill} for Beginners",
                    "platform": "Coursera",
                    "link": f"https://www.coursera.org/search?query={skill}"
                },
                {
                    "title": f"{skill} (NPTEL)",
                    "platform": "NPTEL",
                    "link": "https://nptel.ac.in/courses"
                }
            ],
            "jobs_after_learning": [
                {
                    "role": f"{skill} Engineer",
                    "apply_link": f"https://www.linkedin.com/jobs/search/?keywords={skill}"
                }
            ]
        })

    return {
        "target_role": role,
        "courses": courses
    }
