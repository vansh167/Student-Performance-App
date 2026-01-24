import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./Context/ThemeContext.jsx";

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

function Layout({ children }) {
  const { theme, setTheme } = useContext(ThemeContext);
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
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

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

          <Route path="/admin" element={<AdminPanel />} />

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
          <Route path="/analytics" element={<StudentAnalytics />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
