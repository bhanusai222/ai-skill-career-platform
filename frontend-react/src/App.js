import React, { useState } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-skill-career-platform-xla3.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Upload PDF only");
      return;
    }
    setFile(selected);
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend connection failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url) => {
    if (!url) return;
    window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
  };

  const salaryByRole = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("ai")) return "₹8–16 LPA";
    if (r.includes("data")) return "₹7–14 LPA";
    if (r.includes("backend")) return "₹6–12 LPA";
    if (r.includes("frontend")) return "₹6–11 LPA";
    return "₹5–10 LPA";
  };

  return (
    <div className="app dark">
      <h1 className="title">🚀 AI Skill & Career Intelligence Platform</h1>

      {/* Upload */}
      <div className="card">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button className="main-btn" onClick={uploadResume} disabled={loading}>
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <>
          {/* SKILLS */}
          {result.user_profile?.skills && (
            <div className="card">
              <h2>🛠 Skills Extracted</h2>
              <div className="skill-list">
                {result.user_profile.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* JOBS FROM RESUME */}
          {result.job_opportunities && (
            <div className="card">
              <h2>💼 Jobs Based on Resume</h2>
              <div className="job-grid">
                {result.job_opportunities.map((job, i) => {
                  const fallback =
                    "https://www.linkedin.com/jobs/search/?keywords=" +
                    encodeURIComponent(job.role || "");

                  return (
                    <div key={i} className="job-card">
                      <h3>{job.role}</h3>
                      <p>{job.company}</p>
                      <p className="salary">💰 {salaryByRole(job.role)}</p>

                      <button
                        className="apply-btn"
                        onClick={() =>
                          openLink(
                            job.apply_links?.[0]?.url || fallback
                          )
                        }
                      >
                        Apply Job
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COURSES */}
          {result.learning_plan && (
            <div className="card">
              <h2>📚 Recommended Courses</h2>

              {result.learning_plan.map((item, i) => (
                <div key={i} className="roadmap-item">
                  <h3>{item.skill}</h3>
                  <p>Priority: {item.priority}</p>

                  <div className="course-btns">
                    <button
                      onClick={() =>
                        openLink(
                          "https://www.youtube.com/results?search_query=" +
                            encodeURIComponent(item.skill + " course")
                        )
                      }
                    >
                      ▶ YouTube
                    </button>

                    <button
                      onClick={() =>
                        openLink(
                          "https://www.coursera.org/search?query=" +
                            encodeURIComponent(item.skill)
                        )
                      }
                    >
                      🎓 Coursera
                    </button>

                    <button
                      onClick={() =>
                        openLink(
                          "https://nptel.ac.in/courses?search=" +
                            encodeURIComponent(item.skill)
                        )
                      }
                    >
                      🏫 NPTEL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* JOBS AFTER COURSES */}
          {result.learning_plan && (
            <div className="card">
              <h2>🚀 Jobs After Learning These Skills</h2>
              <div className="job-grid">
                {result.learning_plan.map((item, i) => (
                  <div key={i} className="job-card">
                    <h3>{item.skill} Developer</h3>
                    <p className="salary">💰 ₹6–15 LPA</p>

                    <button
                      className="apply-btn"
                      onClick={() =>
                        openLink(
                          "https://www.linkedin.com/jobs/search/?keywords=" +
                            encodeURIComponent(item.skill)
                        )
                      }
                    >
                      LinkedIn Jobs
                    </button>

                    <button
                      className="apply-btn"
                      onClick={() =>
                        openLink(
                          "https://www.indeed.com/jobs?q=" +
                            encodeURIComponent(item.skill)
                        )
                      }
                    >
                      Indeed Jobs
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;