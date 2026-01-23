import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "../Styling/Ranking.css";

import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Crown,
  TrendingUp,
  TrendingDown,
  Medal,
  Users,
} from "lucide-react";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function Ranking() {
  const [students, setStudents] = useState([]);
  const [avgScore, setAvgScore] = useState(0);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API}/leaderboard/all`);
      setAvgScore(res.data.avg_score || 0);
      setStudents(res.data.students || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load leaderboard!");
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const top3 = useMemo(() => students.slice(0, 3), [students]);

  const getTrend = (score) => {
    if (score >= 80) return "up";
    if (score >= 50) return "mid";
    return "down";
  };

  const TrendChip = ({ score }) => {
    const trend = getTrend(score);
    if (trend === "up")
      return (
        <span className="trend up">
          <TrendingUp size={14} /> Up
        </span>
      );
    if (trend === "down")
      return (
        <span className="trend down">
          <TrendingDown size={14} /> Down
        </span>
      );
    return (
      <span className="trend mid">
        <Minus size={14} /> Avg
      </span>
    );
  };

  const AvgBadge = ({ avg }) => {
    if (avg >= 75)
      return (
        <span className="avgBadge up">
          <ArrowUp size={14} /> {avg}
        </span>
      );
    if (avg <= 50)
      return (
        <span className="avgBadge down">
          <ArrowDown size={14} /> {avg}
        </span>
      );

    return (
      <span className="avgBadge mid">
        <Minus size={14} /> {avg}
      </span>
    );
  };

  return (
    <div className="rankingPage">
      {/* Header */}
      <div className="rankingTop">
        <div className="rankTitle">
          <h1>Global Leaderboard</h1>
          <p>Ranking based on students performance scores (all users)</p>

          <div className="rankMeta">
            <span className="metaTag">
              <Users size={15} /> Students: {students.length}
            </span>
            <span className="metaTag">
              <Medal size={15} /> Top 3 Highlighted
            </span>
          </div>
        </div>

        {/* ✅ compact avg score */}
        <div className="avgMini">
          <span className="avgLabel">Average Score</span>
          <AvgBadge avg={avgScore} />
        </div>
      </div>

      {/* ✅ Stock ticker style */}
      {students.length > 0 && (
        <div className="tickerWrap">
          <div className="tickerTitle">
            <span className="tickDot"></span>
            Live Score Ticker
          </div>

          <div className="tickerLine">
            <div className="tickerMove">
              {[...students, ...students].map((s, index) => (
                <div className="tickItem" key={s._id + "-" + index}>
                  <span className="tickName">{s.name}</span>
                  <span className="tickScore">{s.score}</span>
                  <span className={`tickTrend ${getTrend(s.score)}`}>
                    {getTrend(s.score) === "up" ? (
                      <ArrowUp size={14} />
                    ) : getTrend(s.score) === "down" ? (
                      <ArrowDown size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className="emptyBox">No records available</div>
      ) : (
        <>
          {/* Top 3 */}
          <div className="top3Wrap">
            {top3.map((s, index) => (
              <div className={`topCard pos${index + 1}`} key={s._id}>
                <div className="topRank">
                  <span className={`crownIcon crown${index + 1}`}>
                    <Crown size={16} />
                  </span>
                  <span className="rankNo">#{s.rank}</span>
                </div>

                <h2 className="topName">{s.name}</h2>

                <div className="topScoreRow">
                  <Trophy size={16} className={`trophy trophy${index + 1}`} />
                  <span className="scoreNum">{s.score}</span>
                  <span className="scoreOut">/100</span>
                </div>

                <TrendChip score={s.score} />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="tableWrap">
            <table className="rankTable">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Category</th>
                  <th>Trend</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className={s.rank <= 3 ? "topRow" : ""}>
                    <td>
                      <span className="rankNum">
                        <Trophy size={16} className="trophyIcon" />
                        {s.rank}
                      </span>
                    </td>

                    <td className="studentCell">{s.name}</td>

                    <td>
                      <b>{s.score}</b>/100
                    </td>

                    <td>
                      <span className={`cat ${s.category?.toLowerCase()}`}>
                        {s.category}
                      </span>
                    </td>

                    <td>
                      <TrendChip score={s.score} />
                    </td>
                  </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
