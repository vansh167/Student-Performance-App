import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./Component/ThemeContext.jsx";

const theme = localStorage.getItem("theme");

if (!theme) {
  localStorage.setItem("theme", "dark");
  document.body.setAttribute("data-theme", "dark");
} else {
  document.body.setAttribute("data-theme", theme);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
