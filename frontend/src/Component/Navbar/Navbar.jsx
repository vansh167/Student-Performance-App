import { Link, NavLink } from "react-router-dom";
import { BookOpen } from 'lucide-react';
import "./Navbar.css";
import {
  LayoutDashboard,
  Sparkles,
  User,
  Sun,
  Moon,
} from "lucide-react";

export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
       <BookOpen size={30} color="#e9bc49ff"/>
        <div className="brandText">
          <p className="nav-title">Student Performance</p>
          <p className="nav-sub">Prediction System</p>
        </div>
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/recommendations" className={navClass}>
          <Sparkles size={18} />
          Recommendations
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <User size={18} />
          Profile
        </NavLink>
      </div>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Sun size={20} color="#facc15" />
        ) : (
          <Moon size={20} color="#2563eb" />
        )}
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
    </nav>
  );
}
