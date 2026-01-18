import axios from "axios";
import { useMemo, useState } from "react";
import "./Home.css";

import {
  GraduationCap,
  BarChart3,
  Trophy,
  Save,
  Wand2,
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

export default function Home() {
  const [form, setForm] = useState({
    name: "John Doe",
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

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const predict = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/predict", {
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

  const saveRecord = () => {
    if (!result) return alert("Please predict first!");
    setStudents((prev) => [
      ...prev,
      { Name: form.name, Score: result.score, Category: result.category },
    ]);
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
      acc[cur.Category] = (acc[cur.Category] || 0) + 1;
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

            <button className="btn success" onClick={saveRecord}>
              <Save size={18} />
              Save Record
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="cards">
            <div className="card cardStudent">
              <div className="cardTop">
                <div className="cardIcon">
                  <GraduationCap size={18} />
                </div>
                <p className="cardTitle">Student</p>
              </div>
              <h2 className="cardValue">{form.name}</h2>
              <p className="cardHint">Current input profile</p>
            </div>

            <div className="card cardScore">
              <div className="cardTop">
                <div className="cardIcon">
                  <BarChart3 size={18} />
                </div>
                <p className="cardTitle">Predicted Score</p>
              </div>
              <h2 className="cardValue">
                {result ? result.score : "--"} <span className="small">/100</span>
              </h2>
              <p className="cardHint">Rule-based result</p>
            </div>

            <div className="card cardCategory">
              <div className="cardTop">
                <div className="cardIcon">
                  <Trophy size={18} />
                </div>
                <p className="cardTitle">Category</p>
              </div>
              <h2 className="cardValue">
                {result ? (
                  <span className={badge(result.category)}>{result.category}</span>
                ) : (
                  "--"
                )}
              </h2>
              <p className="cardHint">Performance level</p>
            </div>
          </div>

          <div className="grid">
            <section className="panel">
              <div className="panelHead">
                <h3>Performance Metrics</h3>
                <p>Study, grades, attendance and sleep</p>
              </div>

              <div className="panelBody chartBox">
                <ResponsiveContainer>
                  <BarChart data={metricsData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4269c6" />
                        <stop offset="100%" stopColor="#7597d2" />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        color: "black",
                        fontWeight: "500",
                      }}
                      labelStyle={{ color: "black", fontWeight: "600" }}
                      itemStyle={{ color: "black" }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <div className="panelHead">
                <h3>Prediction Progress</h3>
                <p>Score indicator</p>
              </div>

              <div className="panelBody">
                <div className="progressWrap">
                  <div className="progressTop">
                    <span>Current Score</span>
                    <b>{result ? result.score : 0}%</b>
                  </div>

                  <div className="progress">
                    <div
                      className="progressFill"
                      style={{ width: `${result ? result.score : 0}%` }}
                    />
                  </div>

                  <div className="tip">
                    <b>Tip:</b> Increase study time & attendance for better score.
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="panel tablePanel">
            <div className="panelHead">
              <h3>Saved Students Records</h3>
              <p>Total Records: {students.length}</p>
            </div>

            <div className="panelBody">
              {students.length === 0 ? (
                <p className="empty">No records saved yet. Predict & save student.</p>
              ) : (
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.Name}</td>
                          <td>{s.Score}</td>
                          <td>
                            <span className={badge(s.Category)}>{s.Category}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {students.length > 0 && (
            <section className="panel">
              <div className="panelHead">
                <h3>Category Distribution</h3>
                <p>Pie chart based on saved records</p>
              </div>

              <div className="panelBody chartBox">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" label>
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <div className="footerNote">✅ Professional UI Dashboard Ready for Presentation</div>
        </main>
      </div>
    </div>
  );
}
