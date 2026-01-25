import { useEffect, useState } from "react";
import "../Styling/Resources.css";

// ✅ Deployed backend
const API_BASE = "https://student-performance-backend-xgvt.onrender.com";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [semester, setSemester] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then((res) => res.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filtered = resources.filter((r) => r.semester === semester);

  return (
    <div className="resources-page">
      
      {/* HERO */}
      <div className="resources-hero">
        <div className="resources-hero-overlay" />
        <div className="resources-hero-content">
          <h1>BCA Semester Question Papers</h1>
          <p>Select your semester to access previous year exam papers</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="resources-filter">
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">-- Select Semester --</option>
          <option value="SEM1">Semester 1</option>
          <option value="SEM2">Semester 2</option>
          <option value="SEM3">Semester 3</option>
          <option value="SEM4">Semester 4</option>
          <option value="SEM5">Semester 5</option>
          <option value="SEM6">Semester 6</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="resources-table">
        {!semester ? (
          <div className="select-msg">
            📚 Please select a semester to view question papers
          </div>
        ) : filtered.length === 0 ? (
          <div className="select-msg">
            No question papers uploaded for this semester yet.
          </div>
        ) : (
          <>
            <div className="table-head">
              <span>Subjects Name</span>
              <span>Semester</span>
              <span>Download</span>
            </div>

            {filtered.map((r) => (
              <div key={r._id} className="table-row">
                <span className="t-title">{r.title}</span>
                <span className="t-sem">{r.semester}</span>
                <a
                  href={`${API_BASE}${r.file_url}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
