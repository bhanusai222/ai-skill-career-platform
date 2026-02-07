import requests
from typing import List

SERP_API_KEY = "45e398851ae37f0ac75b14e6d03f5a6c8bc4c9ce5cd13be009cdc454ebba7d9d"
SERP_API_URL = "https://serpapi.com/search"

def fetch_live_jobs(skills: list, location="India"):
    jobs = []
    seen = set()

    for skill in skills[:3]:
        params = {
            "engine": "google_jobs",
            "q": f"{skill} developer",
            "location": location,
            "api_key": SERP_API_KEY
        }

        try:
            response = requests.get(
                "https://serpapi.com/search",
                params=params,
                timeout=10
            )
            data = response.json()

            for job in data.get("jobs_results", [])[:3]:
                title = job.get("title")
                if not title or title in seen:
                    continue

                seen.add(title)
                jobs.append({
                    "role": title,
                    "company": job.get("company_name", "Not specified"),
                    "location": job.get("location", location),
                    "apply_links": [{
                        "platform": "Google Jobs",
                        "url": job.get("related_links", [{}])[0].get("link")
                    }]
                })

        except Exception as e:
            print("SerpAPI error:", e)

            # ✅ FALLBACK JOB LINK (always works)
            jobs.append({
                "role": f"{skill} Developer",
                "company": "Multiple Companies",
                "location": location,
                "apply_links": [
                    {
                        "platform": "LinkedIn",
                        "url": f"https://www.linkedin.com/jobs/search/?keywords={skill}"
                    },
                    {
                        "platform": "Indeed",
                        "url": f"https://in.indeed.com/jobs?q={skill}"
                    }
                ]
            })

    return jobs
