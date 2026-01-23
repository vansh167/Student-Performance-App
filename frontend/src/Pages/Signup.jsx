import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styling/SignupModern.css";
import logo from "../assets/student.png";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    document.body.classList.add("smBody");
    return () => document.body.classList.remove("smBody");
  }, []);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !rePassword.trim()) {
      alert("All fields are required!");
      return;
    }

    if (password !== rePassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/signup`, {
        name,
        email,
        password,
        rePassword, // ✅ for learning
      });

      alert("Signup Successful ✅ Please Login");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  const matchState =
    rePassword.length === 0
      ? "neutral"
      : password === rePassword
      ? "ok"
      : "bad";

  return (
    <div className="smWrap">
      <div className="smBg">
        <div className="smNoise" />
        <div className="smLines" />
        <div className="smGlow g1" />
        <div className="smGlow g2" />
        <div className="smGlow g3" />
      </div>

      <div className="smContainer">
        <div className="smLeft">
          <img src={logo} alt="logo" className="smLogo" />
          <h1>Create Account</h1>
          <p>
            Join <b>Student Performance Prediction System</b> and start using
            analytics, ranking & recommendations.
          </p>

          <div className="smBadgeRow">
            <span className="smBadge">Analytics</span>
            <span className="smBadge">Ranking</span>
            <span className="smBadge">Recommendations</span>
          </div>

          <div className="suAltAuth">
  <span>Already have an account?</span>
  <Link to="/login" className="suAltLink">
    Login
    <span className="suArrow">→</span>
  </Link>
</div>

        </div>

        <div className="smRight">
          <div className="smFormCard">
            <div className="smTop">
              <h2>Sign Up 🚀</h2>
              <p>Create your account in a few seconds.</p>
            </div>

            <div className="smForm">
              {/* ✅ unique classnames for input */}
              <div className="suField">
                <label className="suLabel">Full Name</label>
                <div className="suInputRow">
                  <User size={18} />
                  <input
                    className="suInput"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="suField">
                <label className="suLabel">Email</label>
                <div className="suInputRow">
                  <Mail size={18} />
                  <input
                    className="suInput"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="suField">
                <label className="suLabel">Password</label>
                <div className="suInputRow">
                  <Lock size={18} />
                  <input
                    className="suInput"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="suField">
                <label className="suLabel">Re-enter Password</label>
                <div className="suInputRow">
                  <ShieldCheck size={18} />
                  <input
                    className="suInput"
                    type="password"
                    placeholder="Re-enter password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={`suMatch ${
                  matchState === "ok"
                    ? "ok"
                    : matchState === "bad"
                    ? "bad"
                    : ""
                }`}
              >
                {matchState === "neutral" && "Type confirm password to verify"}
                {matchState === "ok" && "Passwords matched ✅"}
                {matchState === "bad" && "Passwords not matched ❌"}
              </div>

              <button className="smBtn" onClick={handleSignup} disabled={loading}>
                {loading ? (
                  <span className="smBtnLoad">
                    <span className="smSpinner" /> Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="smFooter">
                By signing up you agree to our <span>Terms</span> &{" "}
                <span>Privacy</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
