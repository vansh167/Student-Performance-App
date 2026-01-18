import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "../styling/Recommendations.css";
import { Download, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  MoonStar,
  Clock3,
  BookOpenCheck,
  TrendingUp,
  // ClipboardCopy,
  Users,
  BarChart3,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

const ICONS = {
  ShieldCheck: <ShieldCheck size={18} />,
  MoonStar: <MoonStar size={18} />,
  Clock3: <Clock3 size={18} />,
  BookOpenCheck: <BookOpenCheck size={18} />,
  Sparkles: <Sparkles size={18} />,
  TrendingUp: <TrendingUp size={18} />,
};

export default function Recommendations() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("high");

  const [analysis, setAnalysis] = useState(null);
  // const [copied, setCopied] = useState(false);
const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/students`);
      const list = res.data || [];
      setStudents(list);

      if (list.length > 0) setSelectedId(list[0]._id);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (id) => {
    try {
      const res = await axios.get(`${API}/recommendations/${id}`);
      setAnalysis(res.data);
    } catch (err) {
      console.log(err);
      setAnalysis(null);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedId) fetchAnalysis(selectedId);
  }, [selectedId]);

  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (search.trim()) {
      list = list.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    list.sort((a, b) =>
      sort === "high" ? b.score - a.score : a.score - b.score
    );

    return list;
  }, [students, search, categoryFilter, sort]);

  const categoryCount = useMemo(() => {
    const dist = { Excellent: 0, Good: 0, Average: 0, Poor: 0 };
    students.forEach((s) => {
      if (dist[s.category] !== undefined) dist[s.category]++;
    });
    return dist;
  }, [students]);

  const badge = (category) => {
    if (!category) return "recBadge";
    const c = category.toLowerCase();
    if (c.includes("excellent")) return "recBadge b-excellent";
    if (c.includes("good")) return "recBadge b-good";
    if (c.includes("average")) return "recBadge b-average";
    return "recBadge b-poor";
  };

//   const copyRecommendations = async () => {
//     if (!analysis?.student) return;

//     const s = analysis.student;

//     const text = `
// Student: ${s.name}
// Score: ${s.score}/100
// Category: ${s.category}

// Weakness:
// ${analysis.weaknesses.map((w) => `- ${w}`).join("\n")}

// Recommendations:
// ${analysis.recommendations.map((r) => `- ${r.title}: ${r.desc}`).join("\n")}
//     `.trim();

//     await navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };


  const exportCSV = () => {
  window.open(`${API}/export/csv`, "_blank");
};

const exportPDF = () => {
  window.open(`${API}/export/pdf`, "_blank");
};

  return (
    <div className="recPage">
      <div className="recTop">
        <div>
          <h1>Recommendations</h1>
          <p>Smart guidance generated from students records.</p>
        </div>

        <div className="recStats">
          <div className="statBox">
            <Users size={18} />
            <div>
              <b>{students.length}</b>
              <span>Saved Students</span>
            </div>
          </div>

          <div className="statBox">
            <BarChart3 size={18} />
            <div>
              <b>{categoryCount.Excellent + categoryCount.Good}</b>
              <span>Strong Students</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recToolbar">
        <div className="searchBox">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
          />
        </div>

        <div className="toolbarRight">
          <div className="tool">
            <Filter size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>

            <button className="exportBtn csv" onClick={exportCSV}>
  <FileSpreadsheet size={16} />
  Export CSV
</button>


          </div>

          <div className="tool">
            <ArrowUpDown size={16} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="high">High Score</option>
              <option value="low">Low Score</option>
            </select>
          </div>

          <button
  className="profileBtn"
  onClick={() => selectedId && navigate(`/profile/${selectedId}`)}
>
  View Profile
</button>

{/* <button className="copyBtn" onClick={copyRecommendations}>
  <ClipboardCopy size={16} />
  {copied ? "Copied ✅" : "Copy Plan"}
</button> */}

        </div>
      </div>

      {loading ? (
        <div className="recLoading">Loading recommendations...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="recEmpty">No student found.</div>
      ) : (
        <div className="recMainGrid">
          <div className="recLeft">
            <label className="miniLabel">Select Student</label>
            <select
              className="studentSelect"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {filteredStudents.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.score}/100)
                </option>
              ))}
            </select>

            {analysis?.student && (
              <div className="studentCard">
                <div className="studentTop">
                  <div>
                    <h2>{analysis.student.name}</h2>
                    <p>{analysis.student.gender}</p>
                  </div>
                  <span className={badge(analysis.student.category)}>
                    {analysis.student.category}
                  </span>
                </div>

                <div className="weakBox">
                  <h4>Weakness Detector</h4>
                  <ul>
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="recRight">
            <h3>Action Recommendations</h3>

            <div className="recGrid">
              {analysis?.recommendations?.map((r, idx) => (
                <div key={idx} className="recBox">
                  <div className="recBoxTop">
                    <div className="recIcon">{ICONS[r.icon]}</div>
                    <span className="recTag">{r.tag}</span>
                  </div>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="planBox">
              <h3>Weekly Improvement Plan</h3>
              <div className="planGrid">
                {analysis?.weekly_plan?.map((p, i) => (
                  <div className="planItem" key={i}>
                    <b>{p.day}</b>
                    <span>{p.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
