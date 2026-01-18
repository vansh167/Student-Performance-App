import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Recommendations from "./pages/Recommendations";
import Profile from "./Pages/Profile";
import Navbar from "./Component/Navbar/Navbar";
import Home from "./Component/HomePage/Home";
import About from "./Pages/About";


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

      </Routes>
    </BrowserRouter>
  );
}
