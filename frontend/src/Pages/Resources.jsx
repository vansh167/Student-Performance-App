import { useEffect, useState } from "react";
import "../Styling/Resources.css";
import emptyGif from "../assets/empty.svg";

const API_BASE = "https://student-performance-backend-xgvt.onrender.com";

const subjectsBySem = {
  SEM1: ["Mathematics I","Applied English","Computer Fundamentals","C Programming","Office Automation Tools"],
  SEM2: ["Mathematics II","Communicative English","Digital Electronics","Data Structures","Database Management System"],
  SEM3: ["Mathematics III","Business Practices and Management","Computer Organization","C++ Programming","Desktop Publishing and Designing"],
  SEM4: ["Personnel Management","Accounting","System Analysis and Design","Internet Technology and Web Page Design","Programming in Visual Basic"],
  SEM5: ["Operating System","E-Commerce","Management Information System","ASP.NET Technologies","Computer-Oriented Statistical Methods"],
  SEM6: ["Computer Networks","Numerical Methods","Multimedia Technology","Computer Graphics","Software Engineering"]
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then((res) => res.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false)); // stop loading
  }, []);

  const handleDownload = async (url, title) => {
    try {
      setDownloading(title);

      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const filtered = resources.filter(
    (r) => r.semester === semester && r.subject === subject
  );

  return (
    <div className="resources-page">

      <div className="resources-hero">
        <div className="resources-hero-overlay" />
        <div className="resources-hero-content">
          <h1>
            <span style={{ color: "#7c46fc" }}>BCA Previous Year</span> Question Papers Collection
          </h1>
          <p>Select your semester and subject to access papers</p>
        </div>
      </div>

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

      <div className="resources-table">

        {loading ? (
          <div className="empty-state">
            <img src={emptyGif} alt="Loading" />
            <h2 className="empty-title">Loading resources...</h2>
            <p className="empty-subtitle">Please wait a moment.</p>
          </div>

        ) : !semester || !subject ? (
          <div className="empty-state">
            <img src={emptyGif} alt="Select filters" />
            <h2 className="empty-title">All set!</h2>
            <p className="empty-subtitle">
              Select your semester and subject to view question papers.
            </p>
          </div>

        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <img src={emptyGif} alt="No Papers" />
            <p>No question papers uploaded yet.</p>
          </div>

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
                  disabled={downloading === r.title}
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
