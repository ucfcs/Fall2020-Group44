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
  const [sessionExpanded, setSessionExpanded] = useState(-1);

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
          {sessionExpanded !== -1 ? (
            <div className="session-info-wrapper">
              <div className="session-info-name">
                {overallSessions[sessionExpanded].name}
              </div>
              <button
                className="close-expand-button"
                onClick={() => setSessionExpanded(-1)}
              >
                Back
              </button>
            </div>
          ) : (
            ""
          )}
          <button className="export-button" onClick={exportToCanvas}>
            Export to Webcourses
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>

                {sessionExpanded !== -1 ? (
                  overallSessions[sessionExpanded].questions.title.map(
                    (question, qIndex) => (
                      <th
                        key={sessionExpanded + "-" + qIndex + "question"}
                        className="expanded"
                      >
                        <div className="question-name">
                          {qIndex + 1 + ": " + question}
                        </div>
                      </th>
                    )
                  )
                ) : (
                  <>
                    <th>Totals</th>
                    {overallSessions.map((session, sIndex: number) => (
                      <th key={sIndex} className="session-name">
                        <div>
                          <span>{session.name} </span>
                          <Link
                            className="expand"
                            to={`/gradebook/${session.id}`}
                          >
                            Expand&nbsp;&gt;
                          </Link>
                        </div>
                        <div className="date">{session.date}</div>
                      </th>
                    ))}
                  </>
                )}
              </tr>
              <tr>
                <th>Class Average</th>
                {sessionExpanded !== -1 ? (
                  overallSessions[sessionExpanded].questions.average.map(
                    (average, qIndex) => (
                      <th
                        key={sessionExpanded + "-" + qIndex + "average"}
                        className="expanded align-right"
                      >
                        <div>
                          {average.toFixed(2)}/
                          {overallSessions[sessionExpanded].questions.total[
                            qIndex
                          ].toFixed(2)}
                        </div>
                        <div className="bar">
                          <div
                            className="bar-value"
                            style={{
                              width:
                                (average /
                                  overallSessions[sessionExpanded].questions
                                    .total[qIndex]) *
                                  100 +
                                "%",
                              backgroundColor: getBackgroundColor(
                                average /
                                  overallSessions[sessionExpanded].questions
                                    .total[qIndex]
                              ),
                            }}
                          ></div>
                        </div>{" "}
                      </th>
                    )
                  )
                ) : (
                  <>
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
                          {session.average.toFixed(2)}/
                          {session.total.toFixed(2)}
                        </div>
                        <div className="bar">
                          <div
                            className="bar-value"
                            style={{
                              width:
                                (session.average / session.total) * 100 + "%",
                              backgroundColor: getBackgroundColor(
                                session.average / session.total
                              ),
                            }}
                          ></div>
                        </div>
                      </td>
                    ))}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student: StudentInfo, index: number) => (
                <Student
                  key={index}
                  student={student}
                  sessionExpanded={sessionExpanded}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Gradebook;
