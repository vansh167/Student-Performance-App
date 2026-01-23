import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "../Styling/StudentAnalytics.css";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Users,
  Activity,
  Sun,
  Moon,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function StudentAnalytics() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Analytics fetch failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) window.location.href = "/login";
    else fetchAnalytics();
  }, []);

  const pieColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const activityBlocks = useMemo(() => {
    if (!data?.activity_map) return [];

    return data.activity_map.map((d) => {
      let level = "lv0";
      if (d.value >= 1) level = "lv1";
      if (d.value >= 3) level = "lv2";
      if (d.value >= 5) level = "lv3";
      if (d.value >= 8) level = "lv4";
      return { ...d, level };
    });
  }, [data]);

  if (loading)
    return (
      <div className="anaLoading">
        <div className="anaLoader" />
        Loading Analytics...
      </div>
    );

  if (!data) return null;

  return (
    <div className="anaPage">
      <header className="anaHeader">
        <div className="anaHeaderLeft">
          <h1>Student Analytics</h1>
          <p>Charts, insights & activity tracking for student performance.</p>
        </div>

       
      </header>

      {/* TOP STATS */}
      <section className="anaStats">
        <div className="statCard">
          <div className="statIcon">
            <Users size={18} />
          </div>
          <div>
            <b>{data.summary.total_students}</b>
            <span>Total Students</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <TrendingUp size={18} />
          </div>
          <div>
            <b>{data.summary.avg_score}</b>
            <span>Avg Score</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <Trophy size={18} />
          </div>
          <div>
            <b>{data.summary.top_score}</b>
            <span>Top Score</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            <BarChart3 size={18} />
          </div>
          <div>
            <b>{data.summary.low_score}</b>
            <span>Lowest Score</span>
          </div>
        </div>
      </section>

      {/* CHARTS GRID */}
      <section className="anaGrid">
        {/* Score Trend */}
        <div className="anaPanel">
          <div className="panelHead">
            <h3>📈 Score Trend</h3>
            <p>Average score change (Last 7 days)</p>
          </div>

          <div className="chartBox">
            <ResponsiveContainer>
              <LineChart data={data.score_trend}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="anaPanel">
          <div className="panelHead">
            <h3>🎯 Category Distribution</h3>
            <p>Excellent / Good / Average / Poor</p>
          </div>

          <div className="chartBox">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.categories} dataKey="value" nameKey="name" label>
                  {data.categories.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Activity like GitHub */}
      <section className="anaPanel">
        <div className="panelHead">
          <h3 className="titleWithIcon">
            <Activity size={18} /> Student Activity Map
          </h3>
          <p>Last 30 days saved/updates activity</p>
        </div>

        <div className="activityGrid">
          {activityBlocks.map((a, i) => (
            <div
              key={i}
              className={`activityBox ${a.level}`}
              title={`${a.date} → ${a.value} activities`}
            />
          ))}
        </div>

        <div className="activityLegend">
          <span>Less</span>
          <div className="activityBox lv0" />
          <div className="activityBox lv1" />
          <div className="activityBox lv2" />
          <div className="activityBox lv3" />
          <div className="activityBox lv4" />
          <span>More</span>
        </div>
      </section>

      {/* Active Students - Bottom */}
      <section className="anaPanel anaBottom">
        <div className="panelHead">
          <h3>🔥 Active Students</h3>
          <p>Students saved/updated recently (last 3 days)</p>
        </div>

        {data.active_students.length === 0 ? (
          <p className="anaEmpty">No recent activity found.</p>
        ) : (
          <div className="activeList">
            {data.active_students.map((s) => (
              <div key={s._id} className="activeRow">
                <div className="activeLeft">
                  <b>{s.name}</b>
                  <span>Last Active: {s.last_active}</span>
                </div>

                <div className="scoreBox">
                  <b>{s.score}</b>
                  <span>{s.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
