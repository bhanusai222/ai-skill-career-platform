import React, { useState } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-skill-career-platform-xla3.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // file select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Upload PDF only");
      return;
    }

    setFile(selected);
  };

  // upload resume
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
      console.error(err);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  // open link
  const openLink = (url) => {
    if (!url) return;
    window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
  };

  // salary helper
  const salaryByRole = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("ai")) return "₹8–16 LPA";
    if (r.includes("data")) return "₹7–14 LPA";
    if (r.includes("backend")) return "₹6–12 LPA";
    if (r.includes("frontend")) return "₹6–11 LPA";
    return "₹5–10 LPA";
  };

  return (
    <div className="app">
      <h1>🚀 AI Skill & Career Intelligence Platform</h1>

      {/* Upload */}
      <div className="card upload-card">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button onClick={uploadResume} disabled={loading}>
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div>

          {/* SKILLS */}
          {result.user_profile && (
            <div className="card">
              <h2>🛠 Skills Extracted</h2>
              <div className="skill-list">
                {result.user_profile.skills &&
                  result.user_profile.skills.map((skill, i) => (
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
                        onClick={() =>
                          openLink(
                            job.apply_links &&
                            job.apply_links[0] &&
                            job.apply_links[0].url
                              ? job.apply_links[0].url
                              : fallback
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
                  <b>{item.skill}</b>
                  <p>Priority: {item.priority}</p>

                  <button
                    onClick={() =>
                      openLink(
                        "https://www.youtube.com/results?search_query=" +
                          encodeURIComponent(item.skill + " course")
                      )
                    }
                  >
                    Learn YouTube
                  </button>

                  <button
                    onClick={() =>
                      openLink(
                        "https://www.coursera.org/search?query=" +
                          encodeURIComponent(item.skill)
                      )
                    }
                  >
                    Learn Coursera
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* JOBS FROM COURSES */}
          {result.learning_plan && (
            <div className="card">
              <h2>🚀 Jobs Based on Recommended Skills</h2>

              <div className="job-grid">
                {result.learning_plan.map((item, i) => (
                  <div key={i} className="job-card">
                    <h3>{item.skill} Developer</h3>
                    <p className="salary">💰 ₹6–15 LPA</p>

                    <button
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

        </div>
      )}
    </div>
  );
}

export default App;