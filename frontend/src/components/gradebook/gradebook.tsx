import React, { ReactElement, useState } from "react";
import Student from "./student";
import { StudentInfo, Session } from "../../types";

import "./gradebook.scss";

import data from "./mock-data.json";

const Gradebook = (): ReactElement => {
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
            {overallSessions.map((session: Session, index: number) => (
              <th key={index}>{session.name}</th>
            ))}
          </tr>
          <tr>
            <th>Class Average</th>
            <th>{classAverage}</th>
            {overallSessions.map((session: Session, index: number) => (
              <td key={index}>{session.average}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student: StudentInfo, index: number) => (
            <Student
              key={index}
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
