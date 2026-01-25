import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  LayoutDashboard,
  Sparkles,
  User,
  Sun,
  Moon,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Info,
  ChevronDown,
  Trophy,
  BarChart3,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const closeMenu = () => setOpen(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileOpen(false);
    closeMenu();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openProfile = () => {
    setProfileOpen(false);
    closeMenu();
    navigate(`/profile/${user.id}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/welcome" className="nav-logo" onClick={closeMenu}>
          <div className="logoIconWrap">
            <BookOpen size={26} className="brandIcon" />
          </div>
          <div className="brandText">
            <p className="nav-title">Student Performance</p>
            <p className="nav-sub">Prediction System</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktopOnly">
          {user && (
            <>
              <NavLink to="/home" className={navClass}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>

              <NavLink to="/recommendations" className={navClass}>
                <Sparkles size={18} /> Recommendations
              </NavLink>

              <NavLink to="/ranking" className={navClass}>
                <Trophy size={18} /> Ranking
              </NavLink>

              <NavLink to="/analytics" className={navClass}>
                <BarChart3 size={18} /> Analytics
              </NavLink>

              <NavLink to="/resources" className={navClass}>
                <BookOpen size={18} /> Resources
              </NavLink>
            </>
          )}

          <NavLink to="/about" className={navClass}>
            <Info size={18} /> About
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="desktopOnly nav-right">
          {/* 🌗 THEME BUTTON */}
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? (
              <>
                <Sun size={20} className="sunIcon" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={20} className="moonIcon" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="profileWrap" ref={profileRef}>
            <button
              className={`profileBtn ${profileOpen ? "open" : ""}`}
              onClick={() => setProfileOpen((p) => !p)}
            >
              <User size={18} />
              <ChevronDown size={16} />
            </button>

            <div className={`profileMenu ${profileOpen ? "show" : ""}`}>
              {user ? (
                <>
                  <div className="profileTopBox">
                    <div className="pName">{user.name}</div>
                    <div className="pEmail">{user.email}</div>
                  </div>

                  <button className="profileItem" onClick={openProfile}>
                    <User size={16} /> Profile
                  </button>

                  {user?.role === "admin" && (
                    <button
                      className="profileItem adminItem"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                    >
                      <ShieldCheck size={16} /> Admin Panel
                    </button>
                  )}

                  <button className="profileItem logoutItem" onClick={logout}>
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="profileItem" onClick={() => navigate("/login")}>
                    <LogIn size={16} /> Login
                  </button>
                  <button className="profileItem" onClick={() => navigate("/signup")}>
                    <UserPlus size={16} /> Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`menuBtn mobileOnly ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      <div className={`mobileMenu ${open ? "show" : ""}`}>
        <div className="mobileMenuInner">
          {user && (
            <>
              <NavLink to="/home" className={navClass} onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to="/recommendations" className={navClass} onClick={closeMenu}>Recommendations</NavLink>
              <NavLink to="/ranking" className={navClass} onClick={closeMenu}>Ranking</NavLink>
              <NavLink to="/analytics" className={navClass} onClick={closeMenu}>Analytics</NavLink>
              <NavLink to="/resources" className={navClass} onClick={closeMenu}>Resources</NavLink>

              {user?.role === "admin" && (
                <NavLink to="/admin" className={navClass} onClick={closeMenu}>
                  Admin Panel
                </NavLink>
              )}
            </>
          )}

          <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>

          <div className="mobileDivider" />

          {/* 🌗 MOBILE THEME BUTTON */}
          <button className="theme-btn mobileThemeBtn" onClick={toggleTheme}>
            {theme === "dark" ? (
              <>
                <Sun size={20} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={20} /> Dark Mode
              </>
            )}
          </button>

          {user ? (
            <>
              <button className="profileItem" onClick={openProfile}>Profile</button>
              <button className="profileItem logoutItem" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Signup</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
