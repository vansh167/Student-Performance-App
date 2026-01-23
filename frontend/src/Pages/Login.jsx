import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styling/LoginGithub.css";
import logo from "../assets/student.png";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    document.body.classList.add("lmBody");
    return () => document.body.classList.remove("lmBody");
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return alert("Fill all fields ⚠️");

    try {
      setLoading(true);
      const res = await axios.post(`${API}/login`, { email, password });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      if (res.data.user?.role === "admin") {
  nav("/admin");
} else {
  nav("/home");
}

    } catch (err) {
      alert("Invalid Email or Password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lmWrap">
      {/* Left Branding Section */}
      <div className="lmLeft">
        <div className="lmBg">
          <div className="lmGrid" />
          <span className="lmOrb o1" />
          <span className="lmOrb o2" />
          <span className="lmOrb o3" />
          <span className="lmStar s1" />
          <span className="lmStar s2" />
          <span className="lmStar s3" />
          <span className="lmStar s4" />
        </div>

        <div className="lmBrand">
          <img src={logo} alt="logo" className="lmLogoImg" />

          <h1 className="lmBrandTitle">Student Performance</h1>
          <p className="lmBrandSub">
            Prediction System — analytics, ranking & smart recommendations in one
            dashboard.
          </p>

          <div className="lmPoints">
            <div className="lmPoint">
              <span className="lmDot" /> Predict performance faster
            </div>
            <div className="lmPoint">
              <span className="lmDot" /> Track activity + analytics
            </div>
            <div className="lmPoint">
              <span className="lmDot" /> Personalized study recommendations
            </div>
          </div>

          <div className="lmMiniFooter">
            <span className="lmFooterTxt">Secure login • Modern UI</span>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lmRight">
        <div className="lmPanel">
          <div className="lmTop">
            <h2 className="lmTitle">Welcome Back 👋</h2>
            <p className="lmSub">
              Login to continue and manage your student dashboard.
            </p>
          </div>

          <div className="lmForm">
            <div className="lmField">
              <label>Email</label>
              <input
                className="lmInput"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="lmField">
              <label>Password</label>
              <input
                className="lmInput"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="lmBtn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="lmBtnLoad">
                  <span className="lmSpinner" /> Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="lmLinks">
              <p className="lmHint">
                Don’t have an account?{" "}
                <Link to="/signup" className="lmLink">
                  Signup
                </Link>
              </p>

              <p className="lmHint">
                Back to{" "}
                <Link to="/welcome" className="lmLink">
                  Welcome
                </Link>
              </p>
            </div>
          </div>

          <p className="lmTerms">
            By logging in, you agree to our <span>Terms</span> and{" "}
            <span>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
