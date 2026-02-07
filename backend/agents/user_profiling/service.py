import pdfplumber
import re
from collections import Counter

# ============================
# SKILL CATEGORIES
# ============================
SKILL_CATEGORIES = {
    "Python": "Programming",
    "Java": "Programming",
    "C": "Programming",
    "C++": "Programming",
    "SQL": "Database",
    "MySQL": "Database",
    "MongoDB": "Database",
    "Machine Learning": "AI",
    "Deep Learning": "AI",
    "Artificial Intelligence": "AI",
    "Data Science": "Data",
    "Data Analytics": "Data",
    "Pandas": "Data",
    "Numpy": "Data",
    "Scikit-Learn": "AI",
    "Tensorflow": "AI",
    "Keras": "AI",
    "Matplotlib": "Visualization",
    "Seaborn": "Visualization"
}

# ============================
# NORMALIZATION MAP
# ============================
NORMALIZATION_MAP = {
    "sql": "SQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "artificial intelligence": "Artificial Intelligence",
    "data science": "Data Science",
    "data analytics": "Data Analytics",
    "scikit learn": "Scikit-Learn",
    "scikit-learn": "Scikit-Learn",
    "tensorflow": "Tensorflow",
    "keras": "Keras",
    "numpy": "Numpy",
    "pandas": "Pandas",
    "matplotlib": "Matplotlib",
    "seaborn": "Seaborn",
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "c": "C"
}

# ============================
# MAIN FUNCTION
# ============================
def analyze_resume(file):
    try:
        print("DEBUG: Resume received")

        text = ""
        with pdfplumber.open(file.file) as pdf:
            print("DEBUG: PDF opened")
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "

        print("DEBUG: Text extracted")

        text_lower = text.lower()
        found_skills = []

        # ----------------------------
        # SKILL EXTRACTION
        # ----------------------------
        for raw, normalized in NORMALIZATION_MAP.items():
            if re.search(r"\b" + re.escape(raw) + r"\b", text_lower):
                found_skills.append(normalized)

        print("DEBUG: Skills found (raw)", found_skills)

        # ----------------------------
        # SKILL COUNT & SCORING
        # ----------------------------
        skill_counts = Counter(found_skills)
        skill_profile = {}

        max_count = max(skill_counts.values()) if skill_counts else 1

        for skill, count in skill_counts.items():
            skill_profile[skill] = {
                "score": round(count / max_count, 2),
                "category": SKILL_CATEGORIES.get(skill, "Other")
            }

        # ----------------------------
        # EXPERIENCE EXTRACTION
        # ----------------------------
        exp_match = re.search(r"(\d+)\+?\s+years?", text_lower)
        experience_years = int(exp_match.group(1)) if exp_match else 0

        readiness_score = min(100, len(skill_profile) * 10 + experience_years * 5)

        # ----------------------------
        # PRIMARY DOMAIN
        # ----------------------------
        domain_scores = Counter(
            [info["category"] for info in skill_profile.values()]
        )
        primary_domain = (
            domain_scores.most_common(1)[0][0]
            if domain_scores else "General"
        )

        print("DEBUG: Processing complete")

        # ============================
        # FINAL RETURN (STABLE)
        # ============================
        return {
            "skills": list(skill_profile.keys()),
            "skill_profile": skill_profile,
            "primary_domain": primary_domain,
            "experience_years": experience_years,
            "readiness_score": readiness_score,
            "resume_status": "Parsed Successfully"
        }

    except Exception as e:
        print("❌ ERROR IN analyze_resume:", str(e))
        return {
            "skills": [],
            "skill_profile": {},
            "primary_domain": "Unknown",
            "experience_years": 0,
            "readiness_score": 0,
            "resume_status": f"PDF read error: {str(e)}"
        }
