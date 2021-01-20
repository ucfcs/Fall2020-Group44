import { useState } from "react";
import Student from "./student";
import { StudentInfo, Session } from "../../types";

import "./gradebook.scss";

const data = require("./mock-data.json");

const Gradebook = () => {
  const students = data.students;
  const overallSessions = data.overallSessions;
  const classAverage: number = data.classAverage;

  const [activeSearch, setActiveSearch] = useState(false);

  const focus = () => {
    setActiveSearch(true);
  };

  const blur = (event: any) => {
    if (!event.target.value) {
      setActiveSearch(false);
    }
  };

  return (
    <div className="gradebook">
      <div className="grade-navigation">
        <div className="search">
          <label
            htmlFor="grade-search"
            className={activeSearch ? "active" : ""}
          >
            Search for Student...
          </label>

          <input id="grade-search" onFocus={focus} onBlur={blur} />
        </div>

        <button>Export to Canvas</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Totals</th>
            {overallSessions.map((session: Session) => (
              <th>{session.name}</th>
            ))}
          </tr>
          <tr>
            <th>Class Average</th>
            <th>{classAverage}</th>
            {overallSessions.map((session: Session) => (
              <td>{session.average}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student: StudentInfo) => (
            <Student
              name={student.name}
              total={student.total}
              sessions={student.sessions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gradebook;
