import "../Styling/About.css";

export default function About() {
  return (
    <div className="aboutPage">
      <h1>ℹ About Project</h1>
      <p>
        Student Performance Prediction System built using React UI and Python
        FastAPI logic.
      </p>

      <div className="aboutCard">
        <h3>Tech Stack</h3>
        <ul>
          <li>React (UI)</li>
          <li>FastAPI (Backend logic)</li>
          <li>Recharts (Charts)</li>
        </ul>
      </div>
    </div>
  );
}
