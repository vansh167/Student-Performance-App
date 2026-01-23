import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Recommendations from "./Pages/Recommendations.jsx";
import Profile from "./Pages/Profile.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Home from "./Component/HomePage/Home.jsx";
import About from "./Pages/About.jsx";  
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import Ranking from "./Pages/Ranking.jsx";
import Welcome from "./Pages/Welcome.jsx";
import StudentAnalytics from "./Pages/StudentAnalytics.jsx";
import AdminPanel from "./Pages/AdminPanel.jsx";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// ✅ Navbar show/hide controller
function Layout({ theme, setTheme, children }) {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/welcome", "/login", "/signup"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar theme={theme} setTheme={setTheme} />}
      {children}
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(()=>{
  return localStorage.getItem("theme") || "dark" ;
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout theme={theme} setTheme={setTheme}>
        <Routes>
          {/* ✅ FIRST PAGE = Welcome */}
          <Route path="/" element={<Welcome />} />

          {/* optional: if you still want /welcome route */}
          <Route path="/welcome" element={<Welcome />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected pages */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/recommendations"
            element={
              <PrivateRoute>
                <Recommendations />
              </PrivateRoute>
            }
          />
<Route path="/admin" element={<AdminPanel/>} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path="/student/:id" element={<Profile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<StudentAnalytics/>} />


          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
