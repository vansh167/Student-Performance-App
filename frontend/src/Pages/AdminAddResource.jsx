import { useEffect, useState } from "react";
import "../Styling/AddResource.css";

// ✅ Your deployed backend
const API_BASE = "https://student-performance-backend-xgvt.onrender.com";

export default function AdminAddResource() {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("SEM1");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [filterSem, setFilterSem] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch Resources
  const fetchResources = () => {
    fetch(`${API_BASE}/resources`)
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchResources(); }, []);

  // 🔹 Upload PDF
  const uploadPDF = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("semester", semester);
    formData.append("pdf", file);

    try {
      await fetch(`${API_BASE}/admin/resources/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setTitle("");
      setFile(null);
      fetchResources();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // 🔹 Delete Resource
  const deleteResource = async (id) => {
    if (!window.confirm("Delete this PDF?")) return;

    try {
      await fetch(`${API_BASE}/admin/resources/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchResources();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = filterSem
    ? resources.filter(r => r.semester === filterSem)
    : resources;

  return (
    <div className="admin-resource-wrapper">

      <div className="admin-resource-header">
        <h1>📚 BCA Question Paper Management</h1>
        <p>Upload, filter, and manage semester PDFs easily</p>
      </div>

      <div className="admin-top-section">

        <form className="upload-panel" onSubmit={uploadPDF}>
          <h3>Upload New Paper</h3>

          <input
            type="text"
            placeholder="Enter PDF Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="SEM1">Semester 1</option>
            <option value="SEM2">Semester 2</option>
            <option value="SEM3">Semester 3</option>
            <option value="SEM4">Semester 4</option>
            <option value="SEM5">Semester 5</option>
            <option value="SEM6">Semester 6</option>
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit">Upload PDF</button>
        </form>

        <div className="admin-side-panel">
          <h3>Filter by Semester</h3>

          <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)}>
            <option value="">All Semesters</option>
            <option value="SEM1">Semester 1</option>
            <option value="SEM2">Semester 2</option>
            <option value="SEM3">Semester 3</option>
            <option value="SEM4">Semester 4</option>
            <option value="SEM5">Semester 5</option>
            <option value="SEM6">Semester 6</option>
          </select>

          <div className="stats-box">
            <p>Total Papers</p>
            <h2>{resources.length}</h2>
          </div>
        </div>
      </div>

      <div className="resource-table-wrapper">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Semester</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td><span className="sem-badge">{r.semester}</span></td>
                <td>
                  <a
                    href={`${API_BASE}${r.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="view-btn"
                  >
                    View
                  </a>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteResource(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
