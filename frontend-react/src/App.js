import React, { useState } from "react";
import "./App.css";

/* ================= BACKEND URL ================= */
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-skill-career-platform-xla3.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= BACKEND WAKE ================= */
  const wakeBackend = async () => {
    try {
      console.log("Waking backend...");
      await fetch(API_URL);
      await new Promise((res) => setTimeout(res, 5000));
      console.log("Backend awake");
    } catch (e) {
      console.log("Wake attempt failed (normal if sleeping)");
    }
  };

  /* ================= FILE CHANGE ================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate PDF
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload only PDF file");
      e.target.value = "";
      setFile(null);
      return;
    }

    console.log("Selected file:", selectedFile.name);
    setFile(selectedFile);
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

      const response = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      console.log("Backend response:", data);

      setResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("⚠️ Backend waking up... please wait 30 seconds and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE LINK ================= */
  const openLink = (url) => {
    if (!url) return;
    const safeUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  };

  /* ================= SALARY ================= */
  const salaryByRole = (role = "") => {
    const r = role.toLowerCase();
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
          <div className="card">
            <h2>🛠 Skills Extracted</h2>
            <div className="skill-list">
              {result.user_profile?.skills?.map((skill, i) => (
                <span key={i} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ================= JOBS ================= */}
          {Array.isArray(result.job_opportunities) && (
            <div className="card">
              <h2>💼 Job Opportunities</h2>
              <div className="job-grid">
                {result.job_opportunities.map((job, i) => {
                  const fallbackLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                    job.role || job.title || ""
                  )}`;

                  return (
                    <div key={i} className="job-card">
                      <h3>{job.role || job.title}</h3>
                      <p>{job.company || "Company not specified"}</p>
                      <p className="salary">
                        💰 {salaryByRole(job.role)}
                      </p>

                      <button
                        onClick={() =>
                          openLink(
                            job.apply_links?.[0]?.url || fallbackLink
                          )
                        }
                      >
                        Apply
                      </button>
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

          {/* ================= READINESS ================= */}
          {result.job_readiness && (
            <div className="card">
              <h2>📊 Job Readiness</h2>
              <p><b>Status:</b> {result.job_readiness.status}</p>
              <p><b>Match Score:</b> {result.job_readiness.match_score}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;