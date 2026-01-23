import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "../Styling/AdminPanel.css";
import {
  ShieldCheck,
  Users,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  X,
} from "lucide-react";

const API = "https://student-performance-backend-xgvt.onrender.com";

export default function AdminPanel() {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [search, setSearch] = useState("");

  // ✅ filter
  const [userFilter, setUserFilter] = useState("all"); // all | withStudents | noStudents

  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    if (!token || admin?.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/users`, authHeader);
      setUsers(res.data || []);
    } catch (err) {
      alert("Access denied or session expired ❌");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStudents = async (uid) => {
    try {
      setLoadingStudents(true);
      const res = await axios.get(`${API}/admin/users/${uid}/students`, authHeader);
      setStudents(res.data || []);
    } catch (err) {
      alert("Unable to fetch students ❌");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const deleteUser = async (uid) => {
    const ok = window.confirm("Are you sure you want to delete this user? ⚠️");
    if (!ok) return;

    try {
      await axios.delete(`${API}/admin/users/${uid}`, authHeader);
      alert("User deleted ✅");

      // refresh list
      setUsers((p) => p.filter((u) => u.id !== uid));

      // if deleted selected user
      if (selectedUser?.id === uid) {
        setSelectedUser(null);
        setStudents([]);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed ❌");
    }
  };

  const showPasswords = search.trim() === "09090909";

  // ✅ filter users list
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    // secret key = show all
    let list = q === "09090909" ? users : [...users];

    if (q && q !== "09090909") {
      list = list.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    // filter dropdown
    if (userFilter === "withStudents") {
      list = list.filter((u) => (u.student_count || 0) > 0);
    }

    if (userFilter === "noStudents") {
      list = list.filter((u) => (u.student_count || 0) === 0);
    }

    return list;
  }, [users, search, userFilter]);

  const openUser = (u) => {
    setSelectedUser(u);
    fetchUserStudents(u.id);
  };

  return (
    <div className="adWrap">
      {/* Header */}
      <div className="adHeader">
        <div className="adTitleBox">
          <div className="adIcon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1>Admin Panel</h1>
            <p>Users + Students Activity Control Center</p>
          </div>
        </div>

        <div className="adStats">
          <div className="adStat">
            <Users size={18} />
            <div>
              <b>{users.length}</b>
              <span>Total Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adToolbar">
        <div className="adSearch">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user by name/email..."
          />
        </div>

        <div className="adFilter">
          <Filter size={16} />
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="all">All Users</option>
            <option value="withStudents">With Students</option>
            <option value="noStudents">No Students</option>
          </select>
        </div>

        

        <button className="adBtn" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {/* Layout */}
      <div className="adGrid">
        {/* Users Table */}
        <div className="adCard">
          <div className="adCardHead">
            <h3>All Users</h3>
            <p>Click user to see their student activity</p>
          </div>

          {loading ? (
            <div className="adLoading">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="adEmpty">No users found.</div>
          ) : (
            <div className="adTable">
              <div className={`adTr head ${showPasswords ? "four" : "three"}`}>
                <div>Name</div>
                <div>Email</div>
                <div>Actions</div>
                {showPasswords && <div>Re-enter Pass</div>}
              </div>

              {filteredUsers.map((u) => (
                <div
                  className={`adTr ${showPasswords ? "four" : "three"} ${
                    selectedUser?.id === u.id ? "active" : ""
                  }`}
                  key={u.id}
                >
                  <button className="adUserBtn" onClick={() => openUser(u)}>
                    <b>{u.name}</b>
                    <span>{u.email}</span>
                  </button>

                  <div className="adEmail">{u.email}</div>

                  <div className="adActions">
                    <button
                      className="adTrash"
                      title="Delete User"
                      onClick={() => deleteUser(u.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {showPasswords && (
                    <div className="adPass">{u.rePassword || "—"}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Students Drawer */}
        <div className="adCard">
          <div className="adCardHead row">
            <div>
              <h3>User Students</h3>
              <p>
                {selectedUser
                  ? `Showing students created by: ${selectedUser.name}`
                  : "Select a user to view students"}
              </p>
            </div>

            {selectedUser && (
              <button
                className="adCloseBtn"
                onClick={() => {
                  setSelectedUser(null);
                  setStudents([]);
                }}
              >
                <X size={18} /> Close
              </button>
            )}
          </div>

          {!selectedUser ? (
            <div className="adEmptyBox">
              Select a user from left side 👈
            </div>
          ) : loadingStudents ? (
            <div className="adLoading">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="adEmptyBox">No students found for this user.</div>
          ) : (
            <div className="adStudents">
              {students.map((s) => (
                <div className="adStudentRow" key={s._id}>
                  <div>
                    <b>{s.name}</b>
                    <span>
                      Gender: {s.gender} • Attendance: {s.attendance}% • Study:{" "}
                      {s.study_time}h
                    </span>
                  </div>
                  <div className="adScore">
                    <b>{s.score}</b>
                    <span>{s.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

