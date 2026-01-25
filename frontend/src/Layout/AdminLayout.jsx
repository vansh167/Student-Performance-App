import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UploadCloud, LogOut } from "lucide-react";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ❌ Block if not admin
  if (!user || user.role !== "admin") {
    return <div style={{ padding: "40px" }}>⛔ Admin access only</div>;
  }

  const navClass = ({ isActive }) =>
    isActive ? "admin-link active" : "admin-link";

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <NavLink to="/admin" end className={navClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/add-resource" className={navClass}>
          <UploadCloud size={18} />
          Add Resources
        </NavLink>

        <button className="admin-logout" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
