import Student from "./student";

const Gradebook = () => {
  const students = [{ name: "Davis", total: "20", sessions: ["5"] }];
  const overallSessions = [{ name: "Session 1", average: "5" }];

  return (
    <div className="gradebook">
      <label htmlFor="grade-search">Search for Student</label>

      <input id="grade-search" />

      <button>Export to Canvas</button>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Totals</th>
            {overallSessions.map(session => <th>{session.name}</th>)}
          </tr>
          <tr>
            <th>Class Average</th>
            <th>Add average</th>
            {overallSessions.map(session => <th>{session.average}</th>)}
          </tr>
        </thead>
        <tbody>
          {students.map(student => <Student name={student.name} total={student.total} sessions={student.sessions} />)}
        </tbody>
      </table>
    </div>
  );
};

export default Gradebook;
