import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, UserPlus, LogIn } from "lucide-react";
import "../Styling/Auth.css";

const API = "https://student-performance-app-4j75.onrender.com"; 
// local: http://127.0.0.1:8000

export default function Auth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        await axios.post(`${API}/signup`, form);
        alert("Signup Successful ✅ Now login");
        setMode("login");
        return;
      }

      const res = await axios.post(`${API}/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong!");
    }
  };
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/");
}, []);

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authHead">
          <div className="iconCircle">
            <BookOpen size={34} />
          </div>
          <h1>Student Performance</h1>
          <p>Login / Signup to save your student records</p>
        </div>

        <div className="tabs">
          <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            className={mode === "signup" ? "tab active" : "tab"}
            onClick={() => setMode("signup")}
          >
            <UserPlus size={16} /> Signup
          </button>
        </div>

        <form className="authForm" onSubmit={submit}>
          {mode === "signup" && (
            <div className="field">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <button className="authBtn">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="authFooter">
          {mode === "login" ? (
            <p>
              New user?{" "}
              <span onClick={() => setMode("signup")}>Create account</span>
            </p>
          ) : (
            <p>
              Already have account?{" "}
              <span onClick={() => setMode("login")}>Login here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
