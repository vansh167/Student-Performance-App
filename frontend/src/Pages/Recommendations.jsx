import "../Styling/Recommendations.css";
import { Lightbulb, ArrowRight } from "lucide-react";

export default function Recommendations() {
  const suggestions = [
    {
      title: "Improve Study Routine",
      text: "Increase study time to 8+ hours per week. Make a fixed timetable.",
    },
    {
      title: "Boost Attendance",
      text: "Try to maintain attendance above 75%. Regular attendance improves performance.",
    },
    {
      title: "Sleep and Health",
      text: "Sleep 7–8 hours daily to improve focus and memory.",
    },
    {
      title: "Revision Strategy",
      text: "Revise notes weekly and solve previous year question papers.",
    },
  ];

  return (
    
    <div className="recPage">
      <div className="recHeader">
        <h1>✨ Recommendations</h1>
        <p>Smart tips and improvement suggestions for students.</p>
      </div>

      <div className="recGrid">
        {suggestions.map((s, idx) => (
          <div className="recCard" key={idx}>
            <div className="recTop">
              <div className="recIcon">
                <Lightbulb size={18} />
              </div>
              <h3>{s.title}</h3>
            </div>

            <p className="recText">{s.text}</p>

            <button className="recBtn">
              View Plan <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
