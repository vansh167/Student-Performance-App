import { useEffect, useState } from "react";
import "../Styling/Resources.css";

// ✅ Backend
const API_BASE = "https://student-performance-backend-xgvt.onrender.com";

// Subjects per semester
const subjectsBySem = {
  SEM1: ["Math", "English", "C", "Python", "VSCode"],
  SEM2: ["Math2", "English2", "Data Structures", "DBMS", "OS"],
  SEM3: ["Java", "Web Dev", "DSA", "Computer Networks"],
  SEM4: ["AI", "ML", "Software Engg"],
  SEM5: ["Cloud", "Cyber Security"],
  SEM6: ["Project", "Internship"],
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then((res) => res.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 🔽 FORCE DOWNLOAD FUNCTION
  const handleDownload = async (url, title) => {
    try {
      setDownloading(title);
      const response = await fetch(`${API_BASE}${url}`);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  const filtered = resources.filter(
    (r) => r.semester === semester && r.subject === subject
  );

  return (
    <div className="resources-page">

      {/* HERO */}
      <div className="resources-hero">
        <div className="resources-hero-overlay" />
        <div className="resources-hero-content">
          <h1>
  <span style={{ color: "#f09f13" }}>BCA Previous Year</span> Question Papers Collection
</h1>
          <p>Select your semester and subject to access papers</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="resources-filter">
        <div className="filter-group">

          <div className="filter-field">
            <label>Semester</label>
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSubject("");
              }}
            >
              <option value="">-- Select Semester --</option>
              {Object.keys(subjectsBySem).map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {semester && (
            <div className="filter-field">
              <label>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">-- Select Subject --</option>
                {subjectsBySem[semester].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* TABLE */}
      <div className="resources-table">
        {!semester ? (
          <div className="select-msg">📚 Please select a semester</div>
        ) : !subject ? (
          <div className="select-msg">📘 Please select a subject</div>
        ) : filtered.length === 0 ? (
          <div className="select-msg">No question papers uploaded yet.</div>
        ) : (
          <>
            <div className="table-head">
              <span>Title</span>
              <span>Semester</span>
              <span>Download</span>
            </div>

            {filtered.map((r) => (
              <div key={r._id} className="table-row">
                <span className="t-title">{r.title}</span>
                <span className="t-sem">{r.semester}</span>

                <button
                  className="download-btn"
                  onClick={() => handleDownload(r.file_url, r.title)}
                >
                  {downloading === r.title ? "Downloading..." : "Download"}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
