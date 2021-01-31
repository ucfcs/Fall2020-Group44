import { useState, useContext } from "react";
import Student from "./student";
import { StudentInfo, Session } from "../../types";
import {store} from '../../store';

import "./gradebook.scss";

const data = require("./mock-data.json");

const YUCK = 0.5;
const MEH = 0.75;

const Gradebook = () => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const overallSessions = data.overallSessions;
  const classAverage: number = data.classAverage;

  const overallTotal = data.classTotal;

  const [activeSearch, setActiveSearch] = useState(false);
  const [students, setStudents] = useState(data.students);

  const focus = () => {
    setActiveSearch(true);
  };

  const blur = (event: any) => {
    if (!event.target.value) {
      setActiveSearch(false);
    }
  };

  const searchStudent = (event: any) => {
    setStudents(data.students.filter((student: StudentInfo) => student.name.toLowerCase().includes(event.target.value.toLowerCase())));
  }

  const getBackgroundColor = (percentage: number) : string => {
    if (percentage < YUCK) return '#FF0033';
    else if (percentage < MEH) return '#FFC904';
    else return '#00CA51';
  }

  const expandSession = (session: number) => {
    console.log('lul expand session ' + session);
  }

  const exportToCanvas = () => {
    console.log('Uhhhhh yeah export to canvas I guess');
  }

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

          <input id="grade-search" onFocus={focus} onBlur={blur} onChange={searchStudent}/>
        </div>

        <button onClick={exportToCanvas}>Export to Canvas</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Totals</th>
            {overallSessions.map((session: Session, index: number) => (
              <th>
                <div>
                  <span>{session.name}</span>
                  <span className="expand" onClick={() => expandSession(index)}>&nbsp;Expand &gt;</span>
                </div>
                <div className="date">Jan 23</div>
              </th>
            ))}
          </tr>
          <tr>
            <th>Class Average</th>
            <th className="align-right">
              <div>{classAverage.toFixed(2)}/{overallTotal.toFixed(2)}</div>
              <div className="bar">
                <div className="bar-value" style={{width: classAverage / overallTotal * 100 + '%', backgroundColor: getBackgroundColor(classAverage / overallTotal)}}></div>
              </div>
            </th>
            {overallSessions.map((session: Session) => (
              <td className="align-right">
                <div>{session.average.toFixed(2)}/{session.total.toFixed(2)}</div>
                <div className="bar">
                  <div className="bar-value" style={{width: session.average / session.total * 100 + '%', backgroundColor: getBackgroundColor(session.average / session.total)}}></div>
                </div>
              </td>
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
