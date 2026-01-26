import { useEffect, useState } from "react";
import "../Styling/AddResource.css";

// ✅ Your deployed backend
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

export default function AdminAddResource() {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("SEM1");
  const [subject, setSubject] = useState(subjectsBySem["SEM1"][0]);
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [filterSem, setFilterSem] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setSubject(subjectsBySem[semester][0]);
  }, [semester]);

  const fetchResources = () => {
    fetch(`${API_BASE}/resources`)
      .then(res => res.json())
      .then(data => setResources(data));
  };

  useEffect(() => { fetchResources(); }, []);

  const uploadPDF = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("semester", semester);
    formData.append("subject", subject); // ✅ NEW
    formData.append("pdf", file);

    await fetch(`${API_BASE}/admin/resources/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setTitle("");
    setFile(null);
    fetchResources();
  };

  const deleteResource = async (id) => {
    await fetch(`${API_BASE}/admin/resources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchResources();
  };

  const filtered = filterSem
    ? resources.filter(r => r.semester === filterSem)
    : resources;

  return (
    <div className="admin-resource-wrapper">

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

          {/* Semester */}
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {Object.keys(subjectsBySem).map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          {/* Subject */}
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjectsBySem[semester].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit">Upload PDF</button>
        </form>
      </div>

      {/* Table */}
      <table className="resource-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Semester</th>
            <th>Subject</th> {/* NEW */}
            <th>View</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id}>
              <td>{r.title}</td>
              <td>{r.semester}</td>
              <td>{r.subject}</td> {/* NEW */}
              <td><a href={`${API_BASE}${r.file_url}`} target="_blank">View</a></td>
              <td><button onClick={() => deleteResource(r._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
