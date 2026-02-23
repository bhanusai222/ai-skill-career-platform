import React, { useState } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-skill-career-platform-xla3.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= WAKE BACKEND (SAFE VERSION) ================= */
  const wakeBackend = async () => {
    try {
      console.log("Waking backend...");
      await fetch(API_URL, { method: "GET" });
    } catch (err) {
      console.log("Backend wake request sent");
    }

    // Render free tier may take 40-60 sec
    await new Promise((resolve) => setTimeout(resolve, 45000));
  };

  /* ================= FILE SELECT ================= */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) {
      setFile(null);
      return;
    }

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

    try {
      // STEP 1: Wake backend and wait
      await wakeBackend();

      // STEP 2: Upload resume
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        "Server is starting. Please wait 1 minute and click Analyze again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url) => {
    if (!url) return;
    const safe = url.startsWith("http") ? url : `https://${url}`;
    window.open(safe, "_blank", "noopener,noreferrer");
  };

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

      <div className="card upload-card">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button onClick={uploadResume} disabled={loading}>
          {loading ? "Starting Server & Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <>
          {/* ================= SKILLS ================= */}
          {Array.isArray(result.user_profile?.skills) && (
            <div className="card">
              <h2>🛠 Skills Extracted</h2>
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
              <h2>💼 Job Opportunities</h2>
              <div className="job-grid">
                {result.job_opportunities.map((job, i) => {
                  const fallback = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                    job?.role || job?.title || ""
                  )}`;

                  return (
                    <div key={i} className="job-card">
                      <h3>{job?.role || job?.title}</h3>
                      <p>{job?.company || "Company not specified"}</p>
                      <p className="salary">
                        💰 {salaryByRole(job?.role)}
                      </p>

                      <button
                        onClick={() =>
                          openLink(job?.apply_links?.[0]?.url || fallback)
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
        </>
      )}
    </div>
  );
}

export default App;