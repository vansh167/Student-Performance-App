import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./Home.css";

import {
  GraduationCap,
  BarChart3,
  Trophy,
  Save,
  Wand2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function Home() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    study_time: 5,
    previous_grade: 70,
    attendance: 80,
    sleep_hours: 7,
    family_support: "Yes",
    motivation: "High",
    extracurricular: "Yes",
  });

  const [result, setResult] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`, authHeader);
      setStudents(res.data || []);
    } catch (err) {
      console.log(err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchStudents();
  }, []);

  const validateName = () => {
    if (!form.name.trim()) {
      alert("Student Name is required!");
      return false;
    }
    return true;
  };

  const predict = async () => {
    if (!validateName()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${API}/predict`, {
        ...form,
        study_time: +form.study_time,
        previous_grade: +form.previous_grade,
        attendance: +form.attendance,
        sleep_hours: +form.sleep_hours,
      });
      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Backend not running!");
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async () => {
    if (!validateName()) return;
    if (!result) return alert("Predict first!");

    try {
      setSaving(true);
      await axios.post(`${API}/save`, form, authHeader);
      alert("Data saved");
      await fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Save failed! Check backend & token.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API}/students/${id}`, authHeader);
      await fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Delete failed!");
    }
  };

  const openEdit = (student) => {
    setEditId(student._id);

    setEditForm({
      name: student.name || student.Name || "",
      gender: student.gender || "Male",
      study_time: student.study_time ?? 5,
      previous_grade: student.previous_grade ?? 70,
      attendance: student.attendance ?? 80,
      sleep_hours: student.sleep_hours ?? 7,
      family_support: student.family_support || "Yes",
      motivation: student.motivation || "High",
      extracurricular: student.extracurricular || "Yes",
    });

    setEditOpen(true);
  };

  const updateStudent = async () => {
    try {
      await axios.put(
        `${API}/students/${editId}`,
        {
          ...editForm,
          study_time: +editForm.study_time,
          previous_grade: +editForm.previous_grade,
          attendance: +editForm.attendance,
          sleep_hours: +editForm.sleep_hours,
        },
        authHeader
      );

      setEditOpen(false);
      await fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Update failed!");
    }
  };

  const metricsData = useMemo(
    () => [
      { name: "StudyTime", value: +form.study_time },
      { name: "PreviousGrade", value: +form.previous_grade },
      { name: "Attendance", value: +form.attendance },
      { name: "SleepHours", value: +form.sleep_hours },
    ],
    [form]
  );

  const pieData = useMemo(() => {
    const dist = students.reduce((acc, cur) => {
      const cat = cur.Category || cur.category;
      if (!cat) return acc;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(dist).map((key) => ({ name: key, value: dist[key] }));
  }, [students]);

  const pieColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

  const badge = (category) => {
    if (!category) return "badge";
    const c = category.toLowerCase();
    if (c.includes("excellent")) return "badge b-excellent";
    if (c.includes("good")) return "badge b-good";
    if (c.includes("average")) return "badge b-average";
    return "badge b-poor";
  };

  return (
    <div className="app">
      {editOpen && editForm && (
        <div className="modalOverlay">
          <div className="modalBox">
            <div className="modalHead">
              <h3>Edit Student</h3>
              <button className="iconBtn" onClick={() => setEditOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modalBody">
              <div className="modalGrid">
                <div className="field">
                  <label>Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div className="field">
                  <label>Study Time</label>
                  <input
                    type="number"
                    value={editForm.study_time}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        study_time: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Previous Grade</label>
                  <input
                    type="number"
                    value={editForm.previous_grade}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        previous_grade: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Attendance</label>
                  <input
                    type="number"
                    value={editForm.attendance}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        attendance: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Sleep Hours</label>
                  <input
                    type="number"
                    value={editForm.sleep_hours}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        sleep_hours: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <label>Family Support</label>
                  <select
                    value={editForm.family_support}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        family_support: e.target.value,
                      }))
                    }
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>

                <div className="field">
                  <label>Motivation</label>
                  <select
                    value={editForm.motivation}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        motivation: e.target.value,
                      }))
                    }
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="field">
                  <label>Extracurricular</label>
                  <select
                    value={editForm.extracurricular}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        extracurricular: e.target.value,
                      }))
                    }
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              <button className="btn primary" onClick={updateStudent}>
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <h3 className="sideTitle">Student Inputs</h3>

          <div className="form">
            <div className="field">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Student Name"
                required
              />
            </div>

            <div className="field">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="field">
              <div className="row">
                <label>Weekly Study Time</label>
                <span className="miniValue">{form.study_time} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                name="study_time"
                value={form.study_time}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <div className="row">
                <label>Previous Grade</label>
                <span className="miniValue">{form.previous_grade}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                name="previous_grade"
                value={form.previous_grade}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <div className="row">
                <label>Attendance</label>
                <span className="miniValue">{form.attendance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                name="attendance"
                value={form.attendance}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <div className="row">
                <label>Sleep Hours</label>
                <span className="miniValue">{form.sleep_hours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                name="sleep_hours"
                value={form.sleep_hours}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Family Support</label>
              <select
                name="family_support"
                value={form.family_support}
                onChange={handleChange}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="field">
              <label>Motivation</label>
              <select
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="field">
              <label>Extracurricular</label>
              <select
                name="extracurricular"
                value={form.extracurricular}
                onChange={handleChange}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <button className="btn primary" onClick={predict} disabled={loading}>
              <Wand2 size={18} />
              {loading ? "Predicting..." : "Predict Score"}
            </button>

            <button
              className="btn success"
              onClick={saveRecord}
              disabled={saving}
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Record"}
            </button>
          </div>
        </aside>

        <main className="main">{/* your main code is same */}</main>
      </div>
    </div>
  );
}
