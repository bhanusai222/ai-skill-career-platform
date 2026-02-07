from agents.course_recommendation.data import COURSE_DB

def recommend_courses(skills: list):
    """
    Recommend real-world courses based on missing skills
    """

    recommendations = {}

    for skill in skills:
        if skill in COURSE_DB:
            recommendations[skill] = COURSE_DB[skill]

    return recommendations
