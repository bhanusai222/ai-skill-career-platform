import React, { useState } from "react";
import "./App.css";

/* 🔥 Backend URL (fallback if env not set) */
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-skill-career-platform-xla3.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= BACKEND WAKE FUNCTION ================= */
  const wakeBackend = async () => {
    try {
      await fetch(API_URL);
      await new Promise((res) => setTimeout(res, 4000));
    } catch (e) {
      console.log("Backend waking...");
    }
  };

  /* ================= FILE SELECT ================= */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) {
      setFile(null);
      return;
    }

    // Only allow PDF
    if (selected.type !== "application/pdf") {
      alert("Please upload only PDF file");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selected);
  };

  /* ================= UPLOAD ================= */
  const uploadResume = async () => {
    if (!file) {
      alert("Please upload a resume PDF");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await wakeBackend();

      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Backend error:", err);
      alert("⚠️ Backend waking up... wait 30 sec and try again");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE LINK OPEN ================= */
  const openLink = (url) => {
    if (!url) return;
    const safe = url.startsWith("http") ? url : `https://${url}`;
    window.open(safe, "_blank", "noopener,noreferrer");
  };

  /* ================= SALARY ================= */
  const salaryByRole = (role = "") => {
    const r = role?.toLowerCase() || "";
    if (r.includes("ai") || r.includes("machine")) return "₹8 – 16 LPA";
    if (r.includes("data")) return "₹7 – 14 LPA";
    if (r.includes("backend") || r.includes("python")) return "₹6 – 12 LPA";
    if (r.includes("frontend") || r.includes("react")) return "₹6 – 11 LPA";
    return "₹5 – 10 LPA";
  };

  return (
    <div className="app">
      <h1>🚀 AI Skill & Career Intelligence Platform</h1>

      {/* ================= UPLOAD ================= */}
      <div className="card upload-card">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button onClick={uploadResume} disabled={loading}>
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <>
          {/* ================= SKILLS ================= */}
          {Array.isArray(result.user_profile?.skills) && (
            <div className="card">
              <h2>🛠 Skills Extracted From Your Resume</h2>
              <div className="skill-list">
                {result.user_profile.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ================= JOBS ================= */}
          {Array.isArray(result.job_opportunities) && (
            <div className="card">
              <h2>💼 Jobs Based on Your Resume Skills</h2>

              <div className="job-grid">
                {result.job_opportunities.map((job, i) => {
                  const hasApiLink =
                    Array.isArray(job?.apply_links) &&
                    job.apply_links.some((l) => l?.url);

                  const fallbackLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                    job?.role || job?.title || ""
                  )}`;

                  return (
                    <div key={i} className="job-card">
                      <h3>{job?.role || job?.title}</h3>
                      <p>{job?.company || "Company not specified"}</p>

                      <div className="job-tags">
                        <span className="tag fresher">Fresher</span>
                        <span className="tag experienced">Experienced</span>
                        <span className="tag remote">Remote</span>
                      </div>

                      <p className="salary">
                        💰 {salaryByRole(job?.role)}
                      </p>

                      <div className="job-source">
                        {hasApiLink ? (
                          <span className="badge google">Google Jobs</span>
                        ) : (
                          <span className="badge linkedin">LinkedIn</span>
                        )}
                      </div>

                      {hasApiLink
                        ? job.apply_links.map(
                            (link, idx) =>
                              link?.url && (
                                <button
                                  key={idx}
                                  onClick={() => openLink(link.url)}
                                >
                                  Apply on {link.platform || "Platform"}
                                </button>
                              )
                          )
                        : (
                          <button onClick={() => openLink(fallbackLink)}>
                            Apply on LinkedIn
                          </button>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= CAREER ================= */}
          {result.career && (
            <div className="card">
              <h2>🎯 Recommended Career</h2>
              <p><b>Role:</b> {result.career.role}</p>
              <p><b>Timeline:</b> {result.career.timeline}</p>
              <p><b>Risk:</b> {result.career.risk}</p>
              <p className="salary">
                💰 Expected Salary: {salaryByRole(result.career.role)}
              </p>
            </div>
          )}

          {/* ================= COURSES ================= */}
          {Array.isArray(result.learning_plan) && (
            <div className="card">
              <h2>📚 Skills & Courses You Need to Learn</h2>

              {result.learning_plan.map((item, i) => (
                <div key={i} className="roadmap-item">
                  <b>{item.skill}</b>
                  <p>Priority: {item.priority}</p>

                  <div
                    className="course clickable"
                    onClick={() =>
                      openLink(
                        `https://www.coursera.org/search?query=${encodeURIComponent(
                          item.skill
                        )}`
                      )
                    }
                  >
                    📘 Coursera – {item.skill}
                  </div>

                  <div
                    className="course clickable"
                    onClick={() =>
                      openLink(
                        `https://nptel.ac.in/courses/search?searchText=${encodeURIComponent(
                          item.skill
                        )}`
                      )
                    }
                  >
                    🎓 NPTEL – {item.skill}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= READINESS ================= */}
          {result.job_readiness && (
            <div className="card">
              <h2>📊 Job Readiness</h2>
              <p>
                Status: <b>{result.job_readiness.status}</b>
              </p>
              <p>
                Match Score: {result.job_readiness.match_score}%
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;