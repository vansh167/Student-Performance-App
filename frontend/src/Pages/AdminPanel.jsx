import "../Styling/Records.css";

export default function Records() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");

  return (
    <div className="recordsPage">
      <h1>📌 Saved Records</h1>

      {students.length === 0 ? (
        <p className="infoText">No records saved yet.</p>
      ) : (
        <div className="tableBox">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{s.Name}</td>
                  <td>{s.Score}</td>
                  <td>{s.Category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
