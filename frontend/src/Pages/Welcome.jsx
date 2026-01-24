import React, { useEffect } from "react";
import "../Styling/Welcome.css";
import { Link } from "react-router-dom";
import studentImg from "../assets/student.png";
import gif1 from "../assets/gif1.gif";

export default function Welcome() {
  useEffect(() => {
    const glow = document.querySelector(".cursorGlow");
    const dot = document.querySelector(".cursorDot");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", onMouseMove);

    let rafId;
    function animateCursor() {
      if (glow && dot) {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";

        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      }

      rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ✅ FIX REVEAL (IntersectionObserver)
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));

    // ✅ Live preview data changing
    const sample = [
      { name: "Rahul Sharma", score: "86 / 100", cat: "Excellent", trend: "Up" },
      { name: "Neha Verma", score: "74 / 100", cat: "Good", trend: "Up" },
      { name: "Aman Singh", score: "56 / 100", cat: "Average", trend: "Down" },
      { name: "Kiran Patel", score: "42 / 100", cat: "Poor", trend: "Up" },
    ];

    let idx = 0;
    const intervalId = setInterval(() => {
      idx = (idx + 1) % sample.length;

      const lvName = document.getElementById("lvName");
      const lvScore = document.getElementById("lvScore");
      const lvCat = document.getElementById("lvCat");
      const lvTrend = document.getElementById("lvTrend");

      if (lvName) lvName.textContent = sample[idx].name;
      if (lvScore) lvScore.textContent = sample[idx].score;
      if (lvCat) lvCat.textContent = sample[idx].cat;
      if (lvTrend) lvTrend.textContent = sample[idx].trend;
    }, 2300);

    // ✅ Leaderboard changing (FIXED: inside useEffect)
    const leaderboard = [
      [
        { name: "Rahul Sharma", score: 92, trend: "Up" },
        { name: "Neha Verma", score: 88, trend: "Up" },
        { name: "Aman Singh", score: 81, trend: "Down" },
      ],
      [
        { name: "Neha Verma", score: 94, trend: "Up" },
        { name: "Rahul Sharma", score: 90, trend: "Down" },
        { name: "Aman Singh", score: 79, trend: "Down" },
      ],
      [
        { name: "Aman Singh", score: 95, trend: "Up" },
        { name: "Rahul Sharma", score: 89, trend: "Down" },
        { name: "Neha Verma", score: 85, trend: "Down" },
      ],
    ];

    let lbIdx = 0;
    const lbInterval = setInterval(() => {
      lbIdx = (lbIdx + 1) % leaderboard.length;

      const nm1 = document.getElementById("nm1");
      const sc1 = document.getElementById("sc1");
      const tr1 = document.getElementById("tr1");

      const nm2 = document.getElementById("nm2");
      const sc2 = document.getElementById("sc2");
      const tr2 = document.getElementById("tr2");

      const nm3 = document.getElementById("nm3");
      const sc3 = document.getElementById("sc3");
      const tr3 = document.getElementById("tr3");

      if (nm1) nm1.textContent = leaderboard[lbIdx][0].name;
      if (sc1) sc1.textContent = leaderboard[lbIdx][0].score;
      if (tr1) tr1.textContent = leaderboard[lbIdx][0].trend;

      if (nm2) nm2.textContent = leaderboard[lbIdx][1].name;
      if (sc2) sc2.textContent = leaderboard[lbIdx][1].score;
      if (tr2) tr2.textContent = leaderboard[lbIdx][1].trend;

      if (nm3) nm3.textContent = leaderboard[lbIdx][2].name;
      if (sc3) sc3.textContent = leaderboard[lbIdx][2].score;
      if (tr3) tr3.textContent = leaderboard[lbIdx][2].trend;
    }, 3000);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      clearInterval(intervalId);
      clearInterval(lbInterval);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="bg"></div>
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="gridOverlay"></div>

      <div className="cursorGlow"></div>
      <div className="cursorDot"></div>

      <header className="topbar">
        <div className="brand">
          <img src={studentImg} alt="Student" style={{ height: "55px" }} />
          <div>
            <b>Student Performance</b>
            <span>Prediction System</span>
          </div>
        </div>

<nav className="nav">
  {/* <Link to="/about">About</Link> */}
  <Link to="/login">Login</Link>
  <Link to="/signup" className="navBtn">
    Create Account
  </Link>
</nav>

      </header>

      <main className="hero">
        <section className="heroLeft">
          <div className="tagLine" style={{"borderRadius":"10px", color: "white" }
}}>
            Smart Dashboard • Prediction • Recommendation • Ranking
          </div>

          <h1 className="title" style={{ color: "white" }}
>
            Predict student <span className="grad">performance</span>
            <br />
            and improve results with <span className="grad2">smart suggestions</span>.
          </h1>

          <p className="sub" style={{ color: "white" }}>
            This system helps you <b>predict score</b>, classify students into{" "}
            <b>Excellent / Good / Average / Poor</b>, generate personalized
            recommendations, and show rank positions using leaderboards.
          </p>

          <div className="ctaRow">
            <Link className="btn primary" to="/login">Get Started</Link>


           <Link className="btn ghost" to="/signup">Create Account</Link>
          </div>

          <div className="stats">
            <div className="stat">
              <b style={{ color: "white" }}>AI-style</b>
              <span style={{ color: "white" }}>Recommendation System</span>
            </div>
            <div className="stat">
              <b style={{ color: "white" }}>Real-time</b>
              <span style={{ color: "white" }}>Charts + Prediction</span>
            </div>
            <div className="stat">
              <b style={{ color: "white" }}>Rank</b>
              <span style={{ color: "white" }}>Leaderboard Page</span>
            </div>
          </div>

          {/* ✅ Better looking features (icons + structure) */}
      

        </section>

        <section className="heroRight">
          <div className="imgBox">
            <img src={gif1} alt="Student" />
          </div>
        </section>
      </main>

      {/* ✅ Better bottom section */}
      <section className="bottomSection" id="live-preview">
        <div className="bottomInner">
          <div className="bottomTop">
            <h2>Live Preview & Instructions</h2>
            <p>
              Scroll down to see how your application works with a live preview and steps.
              This section is for user guidance and presentation.
            </p>
          </div>

          {/* ✅ Steps redesigned */}
          <div className="stepGrid stepGridNew">
            <div className="stepCard reveal stepCardNew">
              <div className="stepLeft">
                <div className="stepIconBox blue">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                </div>
              </div>
              <div className="stepMid">
                <h3>Login / Signup</h3>
                <p>Create your account and access dashboard securely.</p>
              </div>
              <div className="stepRight">01</div>
            </div>

            <div className="stepCard reveal stepCardNew">
              <div className="stepLeft">
                <div className="stepIconBox purple">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19h16" />
                    <path d="M7 17V7h10v10" />
                    <path d="M9 7V5h6v2" />
                  </svg>
                </div>
              </div>
              <div className="stepMid">
                <h3>Add Student Details</h3>
                <p>Fill attendance, study time, grades, sleep and motivation.</p>
              </div>
              <div className="stepRight">02</div>
            </div>

            <div className="stepCard reveal stepCardNew">
              <div className="stepLeft">
                <div className="stepIconBox green">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19h16" />
                    <path d="M6 17l4-6 4 3 4-7" />
                  </svg>
                </div>
              </div>
              <div className="stepMid">
                <h3>Predict & Save</h3>
                <p>Predict score, category and save data into your records.</p>
              </div>
              <div className="stepRight">03</div>
            </div>

            <div className="stepCard reveal stepCardNew">
              <div className="stepLeft">
                <div className="stepIconBox orange">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3v18" />
                    <path d="M4 12h16" />
                  </svg>
                </div>
              </div>
              <div className="stepMid">
                <h3>Recommendations</h3>
                <p>Weakness detector and improvement plan generated automatically.</p>
              </div>
              <div className="stepRight">04</div>
            </div>
          </div>

          {/* ✅ bottom layout grid */}
          <div className="bottomGrid2">
            {/* Live Panel */}
            <div className="livePanel reveal">
              <div className="liveHead">
                <h3>Live Result Preview</h3>
                <span className="liveTag">Auto Generated</span>
              </div>

              <div className="liveGrid">
                <div className="liveBox">
                  <b>Student Name</b>
                  <span id="lvName">Rahul Sharma</span>
                </div>
                <div className="liveBox">
                  <b>Predicted Score</b>
                  <span id="lvScore">86 / 100</span>
                </div>
                <div className="liveBox good">
                  <b>Category</b>
                  <span id="lvCat">Excellent</span>
                </div>
                <div className="liveBox trendUp">
                  <b>Trend</b>
                  <span id="lvTrend">Up</span>
                </div>
              </div>

              <div className="liveNote">
                Tip: Increase attendance and maintain study time for consistent improvement.
              </div>

              {/* ✅ added details */}
              <div className="liveExtra">
                <div className="liveExtraItem">
                  <span className="dot blue"></span>
                  <p>Recommended Study Time: <b>3.5 hrs/day</b></p>
                </div>
                <div className="liveExtraItem">
                  <span className="dot green"></span>
                  <p>Attendance Target: <b>90%+</b></p>
                </div>
                <div className="liveExtraItem">
                  <span className="dot purple"></span>
                  <p>Sleep Target: <b>7-8 hrs/day</b></p>
                </div>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="infoPanel reveal">
              <div className="infoTop">
                <h3>Quick Insights</h3>
                <span className="infoTag">Student Guidance</span>
              </div>

              <div className="infoList">
                <div className="infoItem">
                  <div className="infoIcon blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 19h16" />
                      <path d="M6 17l4-6 4 3 4-7" />
                    </svg>
                  </div>
                  <div>
                    <b>Performance Tracking</b>
                    <p>Tracks student progress and improvement trends.</p>
                  </div>
                </div>

                <div className="infoItem">
                  <div className="infoIcon purple">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" />
                    </svg>
                  </div>
                  <div>
                    <b>Suggestion Engine</b>
                    <p>Gives improvement plan based on weak metrics.</p>
                  </div>
                </div>

                <div className="infoItem">
                  <div className="infoIcon green">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3" />
                      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" />
                    </svg>
                  </div>
                  <div>
                    <b>Instant Prediction</b>
                    <p>Updates result preview live for better understanding.</p>
                  </div>
                </div>

                <div className="infoItem">
                  <div className="infoIcon orange">
                    <svg viewBox="0 0 24 24">
                      <path d="M6 2h12v20l-6-4-6 4z" />
                    </svg>
                  </div>
                  <div>
                    <b>Secure Records</b>
                    <p>All saved records are user-based and private.</p>
                  </div>
                </div>
              </div>

              {/* ✅ added bottom extra data */}
              <div className="infoFooter">
                <div className="infoMini">
                  <b>Avg Accuracy</b>
                  <span>87%</span>
                </div>
                <div className="infoMini">
                  <b>Saved Records</b>
                  <span>250+</span>
                </div>
                <div className="infoMini">
                  <b>Categories</b>
                  <span>4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rankPanel reveal" style={{"marginTop":"30px", marginBottom:"-80px"}}>
            <div className="rankHead">
              <h3>Leaderboard (Top 3 Preview)</h3>
              <span className="rankBadge">Live Ranking</span>
            </div>

            <div className="rankList">
              <div className="rankRow gold">
                <span className="rk" id="rk1">#1</span>
                <span className="nm" id="nm1">Rahul Sharma</span>
                <span className="sc" id="sc1">92</span>
                <span className="tr" id="tr1">Up</span>
              </div>

              <div className="rankRow silver">
                <span className="rk" id="rk2">#2</span>
                <span className="nm" id="nm2">Neha Verma</span>
                <span className="sc" id="sc2">88</span>
                <span className="tr" id="tr2">Up</span>
              </div>

              <div className="rankRow bronze">
                <span className="rk" id="rk3">#3</span>
                <span className="nm" id="nm3">Aman Singh</span>
                <span className="sc" id="sc3">81</span>
                <span className="tr" id="tr3">Down</span>
              </div>
            </div>

            <div className="avgBox">
              <b>Average Score:</b>
              <span>76.4</span>
            </div>
          </div>
        </div>
      </section>
        <div className="featureGrid featureGridNewOneLine">
  <div className="featureCard featureCardLine">
    <div className="featLineLeft">
      <div className="featIcon blue">
        <svg viewBox="0 0 24 24">
          <path d="M4 19h16M6 16l3-4 4 3 5-7" />
          <circle cx="6" cy="16" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
          <circle cx="18" cy="8" r="1.5" />
        </svg>
      </div>
    </div>

    <div className="featLineMid">
      <h3>Predict Score</h3>
      <p>Enter student metrics and instantly predict score with category level.</p>
    </div>

    <div className="featLineRight">
      <span>Instant</span>
      <span>Accurate</span>
      <span>Smart</span>
    </div>
  </div>

  <div className="featureCard featureCardLine">
    <div className="featLineLeft">
      <div className="featIcon purple">
        <svg viewBox="0 0 24 24">
          <path d="M8 7h8M8 11h8M8 15h5" />
          <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" />
        </svg>
      </div>
    </div>

    <div className="featLineMid">
      <h3>Save Records</h3>
      <p> Save students data securely and access only your own student records.</p>
    </div>

    <div className="featLineRight">
      <span>Secure</span>
      <span>Private</span>
      <span>Organized</span>
    </div>
  </div>

  <div className="featureCard featureCardLine">
    <div className="featLineLeft">
      <div className="featIcon green">
        <svg viewBox="0 0 24 24">
          <path d="M12 3v18" />
          <path d="M7 8l5-5 5 5" />
          <path d="M7 16l5 5 5-5" />
        </svg>
      </div>
    </div>

    <div className="featLineMid">
      <h3>Smart Recommendations</h3>
      <p>Auto weakness detection and improvement plan for each student.</p>
    </div>

    <div className="featLineRight">
      <span>Personal</span>
      <span>Actionable</span>
      <span>Helpful</span>
    </div>
  </div>

  <div className="featureCard featureCardLine">
    <div className="featLineLeft">
      <div className="featIcon orange">
        <svg viewBox="0 0 24 24">
          <path d="M7 7h10v4H7z" />
          <path d="M9 11v10h6V11" />
          <path d="M5 7l2-4h10l2 4" />
        </svg>
      </div>
    </div>

    <div className="featLineMid">
      <h3>Ranking & Leaderboard</h3>
      <p>Top performers highlight and ranking position with average tracking.</p>
    </div>

    <div className="featLineRight">
      <span>Top 3</span>
      <span>Leaderboard</span>
      <span>Trends</span>
    </div>
  </div>
</div>

    </>
  );
}
