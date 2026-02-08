from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from backend.agents.user_profiling.service import analyze_resume
from backend.agents.skill_gap.service import find_skill_gap
from backend.agents.career_planner.service import recommend_career
from backend.agents.career_roadmap.service import generate_career_roadmap
from backend.agents.learning_recommendation.service import create_learning_plan
from backend.agents.live_jobs.service import fetch_live_jobs
from backend.agents.trending_courses.service import get_trending_courses
from backend.agents.salary_prediction.service import predict_salary

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Career Platform is running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    End-to-end resume intelligence pipeline
    """

    # 1️⃣ Resume Analysis
    user = analyze_resume(file)
    skills = user.get("skills", [])
    primary_domain = user.get("primary_domain", "General")
    experience_years = user.get("experience_years", 0)

    # 2️⃣ Skill Gap Analysis
    skill_gap = find_skill_gap(skills)

    # 3️⃣ Career Recommendation
    career = recommend_career(user, skill_gap)

    # 4️⃣ Career Roadmap
    career_roadmap = generate_career_roadmap(
        career,
        skill_gap
    )

    # 5️⃣ Learning Plan
    learning_plan = create_learning_plan(skill_gap)

    # 6️⃣ Live Jobs (resume skills)
    job_opportunities = fetch_live_jobs(skills)

    # 7️⃣ Trending Courses
    trending_courses = get_trending_courses(
        skill_gap.get("missing_skills", []),
        career.get("role", "Professional")
    )

    # 8️⃣ Salary Prediction
    salary_prediction = predict_salary(
        primary_domain=primary_domain,
        skill_count=len(skills),
        experience_years=experience_years,
        remote=True
    )

    # ✅ FINAL RESPONSE
    return {
        "user_profile": user,
        "skill_gap": skill_gap,
        "career": career,
        "career_roadmap": career_roadmap,
        "learning_plan": learning_plan,
        "job_opportunities": job_opportunities,
        "trending_courses": trending_courses,
        "salary_prediction": salary_prediction
    }
