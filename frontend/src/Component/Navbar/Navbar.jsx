import { Link, NavLink, useNavigate } from "react-router-dom";
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
  LogIn,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";

export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <BookOpen size={30} color="#e9bc49ff" />
        <div className="brandText">
          <p className="nav-title">Student Performance</p>
          <p className="nav-sub">Prediction System</p>
        </div>
      </Link>

      <div className="nav-links desktopOnly">
        {user && (
          <>
            <NavLink to="/" className={navClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/recommendations" className={navClass}>
              <Sparkles size={18} />
              Recommendations
            </NavLink>
          </>
        )}

        <NavLink to="/about" className={navClass}>
          <Info size={18} />
          About
        </NavLink>
      </div>

      <div className="nav-right desktopOnly">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun size={20} color="#facc15" />
          ) : (
            <Moon size={20} color="#2563eb" />
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <div className="profileWrap" ref={dropdownRef}>
          <button className="profileBtn" onClick={() => setDropOpen(!dropOpen)}>
            <User size={20} />
          </button>

          {dropOpen && (
            <div className="profileDropdown">
              <div className="profileHead">
                <b>{user ? user.name : "Guest"}</b>
                <span>{user ? user.email : "Not Logged In"}</span>
              </div>

              <div className="profileMenu">
                {user ? (
                  <>
                    <button
                      className="dropItem"
                      onClick={() => {
                        setDropOpen(false);
                        navigate(`/profile/${user.id}`);
                      }}
                    >
                      <User size={18} />
                      Profile
                    </button>

                    <button className="dropItem logout" onClick={logout}>
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="dropItem"
                    onClick={() => {
                      setDropOpen(false);
                      navigate("/login");
                    }}
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="menuBtn mobileOnly" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`mobileMenu ${open ? "show" : ""}`}>
        {user && (
          <>
            <NavLink to="/" className={navClass} onClick={closeMenu}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/recommendations"
              className={navClass}
              onClick={closeMenu}
            >
              <Sparkles size={18} />
              Recommendations
            </NavLink>

            <NavLink
              to={`/profile/${user.id}`}
              className={navClass}
              onClick={closeMenu}
            >
              <User size={18} />
              Profile
            </NavLink>

            <button className="dropItem logout" onClick={logout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}

        {!user && (
          <button
            className="dropItem"
            onClick={() => {
              closeMenu();
              navigate("/login");
            }}
          >
            <LogIn size={18} />
            Login
          </button>
        )}

        <NavLink to="/about" className={navClass} onClick={closeMenu}>
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
