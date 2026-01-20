import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
// Correct
import Recommendations from "./Pages/Recommendations.jsx";
import Profile from "./Pages/Profile.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Home from "./Component/HomePage/Home.jsx";
import About from "./Pages/About.jsx";
import About from "./Pages/Auth.jsx";



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
        <Route path="/" element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/about" element={<About/>} />
        <Route path="/auth" element={<Auth/>} />
      </Routes>
    </BrowserRouter>
  );
}
