import React, {
  useState,
  ReactElement,
  SyntheticEvent,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import Student from "./student";
import { StudentInfo } from "../../types";

import "./gradebook.scss";

import data from "./mock-data.json";
import HomeHeader from "../home-header/home-header";
import { store } from "../../store";

const RED = 0.5;
const YELLOW = 0.75;

const Gradebook = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const blur = (event: SyntheticEvent) => {
    if (!(event.target as HTMLInputElement).value) {
      setActiveSearch(false);
    }
  };

  const searchStudent = (event: SyntheticEvent) => {
    setStudents(
      data.students.filter((student: StudentInfo) =>
        student.name
          .toLowerCase()
          .includes((event.target as HTMLInputElement).value.toLowerCase())
      )
    );
  };

  const getBackgroundColor = (percentage: number): string => {
    if (percentage < RED) return "#FF0033";
    else if (percentage < YELLOW) return "#FFC904";
    else return "#00CA51";
  };

  const exportToCanvas = () => {
    dispatch({ type: "open-export-modal" });
  };

  return (
    <>
      <HomeHeader />

      <div className="gradebook">
        <div className="grade-navigation">
          <div className="search">
            <label
              htmlFor="grade-search"
              className={activeSearch ? "active" : ""}
            >
              Search for Student...
            </label>

            <input
              id="grade-search"
              onFocus={focus}
              onBlur={blur}
              onChange={searchStudent}
            />
          </div>
          <button className="export-button" onClick={exportToCanvas}>
            Export to Webcourses
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>

                <th>Totals</th>
                {overallSessions.map((session, sIndex: number) => (
                  <th key={sIndex} className="session-name">
                    <div>
                      <span>{session.name} </span>
                      <Link className="expand" to={`/gradebook/${session.id}`}>
                        Expand&nbsp;&gt;
                      </Link>
                    </div>
                    <div className="date">{session.date}</div>
                  </th>
                ))}
              </tr>
              <tr>
                <th>Class Average</th>
                <th className="align-right">
                  <div>
                    {classAverage.toFixed(2)}/{overallTotal.toFixed(2)}
                  </div>
                  <div className="bar">
                    <div
                      className="bar-value"
                      style={{
                        width: (classAverage / overallTotal) * 100 + "%",
                        backgroundColor: getBackgroundColor(
                          classAverage / overallTotal
                        ),
                      }}
                    ></div>
                  </div>
                </th>
                {overallSessions.map((session, sIndex: number) => (
                  <td key={sIndex} className="align-right">
                    <div>
                      {session.average.toFixed(2)}/{session.total.toFixed(2)}
                    </div>
                    <div className="bar">
                      <div
                        className="bar-value"
                        style={{
                          width: (session.average / session.total) * 100 + "%",
                          backgroundColor: getBackgroundColor(
                            session.average / session.total
                          ),
                        }}
                      ></div>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student: StudentInfo, index: number) => (
                <Student key={index} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Gradebook;
