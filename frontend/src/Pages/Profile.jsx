import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styling/Profile.css";

import {
  ArrowLeft,
  GraduationCap,
  BarChart3,
  Trophy,
  ShieldCheck,
  MoonStar,
  Clock3,
  BookOpenCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchStudent = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const res = await axios.get(`${API}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudent(res.data);
    } catch (err) {
      console.log(err);
      alert("Student not found!");
      navigate("/recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const badge = (category) => {
    if (!category) return "badge";
    const c = category.toLowerCase();
    if (c.includes("excellent")) return "badge b-excellent";
    if (c.includes("good")) return "badge b-good";
    if (c.includes("average")) return "badge b-average";
    return "badge b-poor";
  };

  const weaknesses = useMemo(() => {
    if (!student) return [];
    const weak = [];
    if (Number(student.attendance) < 75) weak.push("Low Attendance");
    if (Number(student.sleep_hours) < 6) weak.push("Poor Sleep");
    if (Number(student.study_time) < 6) weak.push("Low Study Time");
    if (Number(student.previous_grade) < 60) weak.push("Weak Academics");
    if ((student.motivation || "").toLowerCase() === "low")
      weak.push("Low Motivation");

    return weak.length ? weak : ["No major weakness detected ✅"];
  }, [student]);

  const recommendations = useMemo(() => {
    if (!student) return [];

    const recs = [];

    if (Number(student.attendance) < 75)
      recs.push({
        icon: <ShieldCheck size={18} />,
        title: "Improve Attendance",
        desc: "Target 85%+ attendance for better academic growth.",
      });

    if (Number(student.sleep_hours) < 6)
      recs.push({
        icon: <MoonStar size={18} />,
        title: "Fix Sleep Routine",
        desc: "Aim 7–8 hours sleep to improve focus and memory.",
      });

    if (Number(student.study_time) < 6)
      recs.push({
        icon: <Clock3 size={18} />,
        title: "Increase Study Time",
        desc: "Minimum 8–10 hrs/week using Pomodoro technique.",
      });

    if (Number(student.previous_grade) < 60)
      recs.push({
        icon: <BookOpenCheck size={18} />,
        title: "Work on Basics",
        desc: "Revise fundamentals daily + solve practice questions.",
      });

    if ((student.motivation || "").toLowerCase() === "low")
      recs.push({
        icon: <Sparkles size={18} />,
        title: "Build Motivation",
        desc: "Set weekly goals + small rewards to stay motivated.",
      });

    recs.push({
      icon: <TrendingUp size={18} />,
      title: "Smart Action Plan",
      desc: "Daily: 45m revision + 30m practice + 15m notes.",
    });

    return recs;
  }, [student]);

  if (loading) return <div className="profileLoading">Loading profile...</div>;
  if (!student) return null;

  return (
    <div className="profilePage">
      <div className="profileTop">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="profileTitle">
          <h1>Student Profile</h1>
          <p>Full detailed performance record & improvement plan</p>
        </div>
      </div>

      <div className="profileCards">
        <div className="pCard">
          <div className="pIcon">
            <GraduationCap size={18} />
          </div>
          <p className="pLabel">Student</p>
          <h2>{student.name}</h2>
        </div>

        <div className="pCard">
          <div className="pIcon">
            <BarChart3 size={18} />
          </div>
          <p className="pLabel">Score</p>
          <h2>{student.score}/100</h2>
        </div>

        <div className="pCard">
          <div className="pIcon">
            <Trophy size={18} />
          </div>
          <p className="pLabel">Category</p>
          <h2>
            <span className={badge(student.category)}>{student.category}</span>
          </h2>
        </div>
      </div>

      <div className="profileGrid">
        <div className="infoBox">
          <h3>Student Information</h3>

          <div className="infoGrid">
            <div>
              <b>Gender</b>
              <span>{student.gender}</span>
            </div>

            <div>
              <b>Attendance</b>
              <span>{student.attendance}%</span>
            </div>

            <div>
              <b>Study Time</b>
              <span>{student.study_time} hrs/week</span>
            </div>

            <div>
              <b>Sleep</b>
              <span>{student.sleep_hours} hrs</span>
            </div>

            <div>
              <b>Previous Grade</b>
              <span>{student.previous_grade}%</span>
            </div>

            <div>
              <b>Motivation</b>
              <span>{student.motivation}</span>
            </div>

            <div>
              <b>Family Support</b>
              <span>{student.family_support}</span>
            </div>

            <div>
              <b>Extracurricular</b>
              <span>{student.extracurricular}</span>
            </div>
          </div>
        </div>

        <div className="weakBox2">
          <h3>Weakness Detector</h3>
          <ul>
            {weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>

        <div className="recBox2">
          <h3>Recommendations</h3>
          <div className="recList">
            {recommendations.map((r, i) => (
              <div key={i} className="recItem">
                <div className="recIcon2">{r.icon}</div>
                <div>
                  <b>{r.title}</b>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
