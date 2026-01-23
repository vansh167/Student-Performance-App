import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "../Styling/Recommendations.css";
import { FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  Users,
  BarChart3,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const API = "https://student-performance-backend-xgvt.onrender.com";

const ICONS = {
  ShieldCheck: <ShieldCheck size={18} />,
  MoonStar: <MoonStar size={18} />,
  Clock3: <Clock3 size={18} />,
  BookOpenCheck: <BookOpenCheck size={18} />,
  Sparkles: <Sparkles size={18} />,
  TrendingUp: <TrendingUp size={18} />,
};

export default function Recommendations() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("high");

  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // 3rd party recommended resources
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);

  const navigate = useNavigate();

  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const safeCategory = (s) => s?.category || s?.Category || "Unknown";

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/students`, authHeader);
      const list = res.data || [];
      setStudents(list);

      setSelectedId((prev) => {
        if (!list.length) return "";
        if (prev && list.some((x) => x._id === prev)) return prev;
        return list[0]._id;
      });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (id) => {
    try {
      setAnalysisLoading(true);
      const res = await axios.get(`${API}/recommendations/${id}`, authHeader);
      setAnalysis(res.data || null);
    } catch (err) {
      console.log(err);
      setAnalysis(null);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ✅ 3rd party API: Open Library Books Suggestions (No API key)
  const fetchBooksForWeakness = async (weaknessList = []) => {
    try {
      const topic = weaknessList?.[0] || "study skills";
      setResourceLoading(true);

      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          topic
        )}&limit=6`
      );

      const docs = res.data?.docs || [];

      const mapped = docs
        .filter((b) => b?.title)
        .slice(0, 6)
        .map((b) => ({
          title: b.title,
          author: (b.author_name && b.author_name[0]) || "Unknown Author",
          year: b.first_publish_year || "-",
          link: b.key ? `https://openlibrary.org${b.key}` : null,
        }));

      setResources(mapped);
    } catch (e) {
      console.log(e);
      setResources([]);
    } finally {
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    if (!token) window.location.href = "/login";
    else fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedId) fetchAnalysis(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (analysis?.weaknesses?.length) {
      fetchBooksForWeakness(analysis.weaknesses);
    } else {
      setResources([]);
    }
  }, [analysis]);

  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (search.trim()) {
      list = list.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((s) => safeCategory(s) === categoryFilter);
    }

    list.sort((a, b) =>
      sort === "high"
        ? (b.score || 0) - (a.score || 0)
        : (a.score || 0) - (b.score || 0)
    );

    return list;
  }, [students, search, categoryFilter, sort]);

  const categoryCount = useMemo(() => {
    const dist = { Excellent: 0, Good: 0, Average: 0, Poor: 0 };
    students.forEach((s) => {
      const cat = safeCategory(s);
      if (dist[cat] !== undefined) dist[cat]++;
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

  const exportCSV = () => {
    window.open(`${API}/export/csv?token=${token}`, "_blank");
  };

  const selectedStudent = useMemo(() => {
    return students.find((s) => s._id === selectedId);
  }, [students, selectedId]);

  return (
    <div className="recPage">
      {/* HEADER */}
      <div className="recHeader">
        <div>
          <h1>Recommendations</h1>
          <p>Smart guidance generated from students records.</p>
        </div>

        <div className="recHeaderStats">
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

      {/* TOOLBAR */}
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
          </div>

          <div className="tool">
            <ArrowUpDown size={16} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="high">High Score</option>
              <option value="low">Low Score</option>
            </select>
          </div>

          <button className="exportBtn csv" onClick={exportCSV}>
            <FileSpreadsheet size={16} />
            Export CSV
          </button>

          <button
            className="viewBtn"
            onClick={() => selectedId && navigate(`/student/${selectedId}`)}
            disabled={!selectedId}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      {loading ? (
        <div className="recLoading">
          <div className="recSpinner" />
          Loading recommendations...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="recEmpty">
          <Sparkles size={20} />
          No student found.
        </div>
      ) : (
        <div className="recLayout">
          {/* LEFT SIDEBAR */}
          <aside className="recSidebar">
            <div className="sideTop">
              <span className="miniLabel">Students</span>
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
            </div>

            <div className="studentList">
              {filteredStudents.slice(0, 12).map((s) => (
                <button
                  key={s._id}
                  onClick={() => setSelectedId(s._id)}
                  className={`studentPill ${
                    selectedId === s._id ? "active" : ""
                  }`}
                >
                  <div className="pillLeft">
                    <b>{s.name}</b>
                    <span>{safeCategory(s)}</span>
                  </div>
                  <div className="pillScore">{s.score || 0}</div>
                </button>
              ))}
            </div>

            {analysis?.student && (
              <motion.div
                className="studentCard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="studentTop">
                  <div>
                    <h2>{analysis.student.name}</h2>
                    <p>{analysis.student.gender || "—"}</p>
                  </div>
                  <span className={badge(analysis.student.category)}>
                    {analysis.student.category}
                  </span>
                </div>

                <div className="weakBox">
                  <h4>Weakness Detector</h4>
                  {analysis.weaknesses?.length ? (
                    <ul>
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mutedTxt">No weakness data found.</p>
                  )}
                </div>
              </motion.div>
            )}
          </aside>

          {/* RIGHT CONTENT */}
          <main className="recContent">
            <div className="contentHead">
              <div>
                <h3>Action Recommendations</h3>
                <p className="mutedTxt">
                  Personalized steps for{" "}
                  <b>{selectedStudent?.name || "student"}</b>
                </p>
              </div>

              <AnimatePresence mode="wait">
                {analysisLoading ? (
                  <motion.div
                    key="loading"
                    className="smallLoading"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <div className="dotPulse" />
                    Generating analysis...
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    className="smallLoading ready"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <Sparkles size={16} />
                    Updated
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="recGrid">
              {analysis?.recommendations?.length ? (
                analysis.recommendations.map((r, idx) => (
                  <motion.div
                    key={idx}
                    className="recBox"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: idx * 0.05 }}
                  >
                    <div className="recBoxTop">
                      <div className="recIcon">
                        {ICONS[r.icon] || <Sparkles size={18} />}
                      </div>
                      <span className="recTag">{r.tag || "Recommendation"}</span>
                    </div>
                    <h4>{r.title}</h4>
                    <p>{r.desc}</p>
                  </motion.div>
                ))
              ) : (
                <div className="recEmptyCard">
                  <Sparkles size={18} />
                  No recommendations available for this student.
                </div>
              )}
            </div>

            <div className="planBox">
              <h3>Weekly Improvement Plan</h3>

              <div className="planGrid">
                {analysis?.weekly_plan?.length ? (
                  analysis.weekly_plan.map((p, i) => (
                    <motion.div
                      className="planItem"
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <b>{p.day}</b>
                      <span>{p.task}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="mutedTxt">No weekly plan found.</div>
                )}
              </div>
            </div>

            {/* 3rd party resources */}
            <div className="thirdPartyBox">
              <div className="thirdTop">
                <h3>
                  <BookOpen size={18} /> Learning Resources
                </h3>
                <p className="mutedTxt">
                  Suggested books related to weakness (Open Library)
                </p>
              </div>

              {resourceLoading ? (
                <div className="miniLoaderRow">
                  <div className="dotPulse" />
                  Fetching resources...
                </div>
              ) : resources.length ? (
                <div className="resourceGrid">
                  {resources.map((b, idx) => (
                    <a
                      key={idx}
                      href={b.link || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="resourceCard"
                    >
                      <div className="resTop">
                        <b>{b.title}</b>
                        <ExternalLink size={16} />
                      </div>
                      <span className="mutedTxt">
                        {b.author} • {b.year}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mutedTxt">No resources found.</div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
