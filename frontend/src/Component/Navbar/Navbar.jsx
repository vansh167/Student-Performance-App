import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

import {
  LayoutDashboard,
  Sparkles,
  User,
  Sun,
  
  Moon,
  Menu,
  X,
  Info,
} from "lucide-react";
import { useState } from "react";
import { BookOpen } from "lucide-react";

export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      {/* ✅ Logo */}
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <BookOpen size={30} color="#e9bc49ff" />
        <div className="brandText">
          <p className="nav-title">Student Performance</p>
          <p className="nav-sub">Prediction System</p>
        </div>
      </Link>

      {/* ✅ Desktop Links */}
      <div className="nav-links desktopOnly">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/recommendations" className={navClass}>
          <Sparkles size={18} />
          Recommendations
        </NavLink>

        <NavLink to="/about" className={navClass}>
  <Info size={18} />
  About
</NavLink>
      </div>

      {/* ✅ Desktop Theme */}
      <button className="theme-btn desktopOnly" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Sun size={20} color="#facc15" />
        ) : (
          <Moon size={20} color="#2563eb" />
        )}
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>

      {/* ✅ Mobile Hamburger */}
      <button className="menuBtn mobileOnly" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ✅ Mobile Drawer */}
      <div className={`mobileMenu ${open ? "show" : ""}`}>
        <NavLink to="/" className={navClass} onClick={closeMenu}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/recommendations" className={navClass} onClick={closeMenu}>
          <Sparkles size={18} />
          Recommendations
        </NavLink>

        
<NavLink to="/about" className={navClass}>
  <Info size={18} />
  About
</NavLink>
        <button className="theme-btn mobileThemeBtn" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun size={20} color="#facc15" />
          ) : (
            <Moon size={20} color="#2563eb" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </nav>
  );
}
