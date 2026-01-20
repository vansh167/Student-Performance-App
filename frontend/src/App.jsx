import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Recommendations from "./Pages/Recommendations.jsx";
import Profile from "./Pages/Profile.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Home from "./Component/HomePage/Home.jsx";
import About from "./Pages/About.jsx";
import Auth from "./Pages/Auth.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  const [theme, setTheme] = useState("dark");

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
      <Navbar theme={theme} setTheme={setTheme} />

      <Routes>
        <Route path="/about" element={<About />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
