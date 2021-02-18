import React, { useState, ReactElement, SyntheticEvent } from "react";
import Student from "./student";
import { StudentInfo, Session } from "../../types";

import "./gradebook.scss";

import data from "./mock-data.json";
import HomeHeader from "../home-header/home-header";

const RED = 0.5;
const YELLOW = 0.75;

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Gradebook = (): ReactElement => {
  const forceUpdate = useForceUpdate();

  const overallSessions = data.overallSessions;
  const classAverage: number = data.classAverage;
  const overallTotal = data.classTotal;

  const [activeSearch, setActiveSearch] = useState(false);
  const [students, setStudents] = useState(data.students);
  const [isExpanded, setIsExpanded] = useState(
    new Array(overallSessions.length).fill(false)
  );

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

  const expandSession = (session: number) => {
    isExpanded[session] = !isExpanded[session];
    setIsExpanded(isExpanded);
    forceUpdate();
  };

  const exportToCanvas = () => {
    console.log("Uhhhhh yeah export to canvas I guess");
  };

  const createQuestionHeaders = (sIndex: number) => {
    return isExpanded[sIndex]
      ? overallSessions[sIndex].questions.title.map((question, qIndex) => (
          <th key={sIndex + "-" + qIndex + "question"} className="expanded">
            <div>{overallSessions[sIndex].name}</div>
            <div className="question-name">{qIndex + 1 + ": " + question}</div>
          </th>
        ))
      : "";
  };

  const createQuestionAverages = (sIndex: number) => {
    return isExpanded[sIndex]
      ? overallSessions[sIndex].questions.average.map((average, qIndex) => (
          <th
            key={sIndex + "-" + qIndex + "average"}
            className="expanded align-right"
          >
            <div>
              {average.toFixed(2)}/
              {overallSessions[sIndex].questions.total[qIndex].toFixed(2)}
            </div>
            <div className="bar">
              <div
                className="bar-value"
                style={{
                  width:
                    (average /
                      overallSessions[sIndex].questions.total[qIndex]) *
                      100 +
                    "%",
                  backgroundColor: getBackgroundColor(
                    average / overallSessions[sIndex].questions.total[qIndex]
                  ),
                }}
              ></div>
            </div>{" "}
          </th>
        ))
      : "";
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

          <button onClick={exportToCanvas}>Export to Canvas</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Totals</th>
                {overallSessions.map((session: Session, sIndex: number) => [
                  <th key={sIndex} className="session-name">
                    <div>
                      <span>{session.name} </span>
                      <span
                        className="expand"
                        onClick={() => expandSession(sIndex)}
                      >
                        {isExpanded[sIndex] ? "Close <" : "Expand >"}
                      </span>
                    </div>
                    <div className="date">{session.date}</div>
                  </th>,
                  createQuestionHeaders(sIndex),
                ])}
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
                {overallSessions.map((session: Session, sIndex: number) => [
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
                  </td>,
                  createQuestionAverages(sIndex),
                ])}
              </tr>
            </thead>
            <tbody>
              {students.map((student: StudentInfo, index: number) => (
                <Student
                  key={index}
                  student={student}
                  isExpanded={isExpanded}
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
