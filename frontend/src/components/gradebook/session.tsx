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

interface Prop {
  match: {
    params: {
      [key: string]: number;
    };
  };
}

const GradebookSession = (props: Prop): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const overallSessions = data.overallSessions;

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

  const exportToCanvas = (): void => {
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
          <div className="session-info-wrapper">
            <div className="session-info-name">
              {overallSessions[props.match.params.id].name}
            </div>
            <Link className="close-expand-button" to="/gradebook">
              Back
            </Link>
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

                {overallSessions[props.match.params.id].questions.title.map(
                  (question, qIndex) => (
                    <th key={qIndex + "question"} className="expanded">
                      <div className="question-name">
                        {qIndex + 1 + ": " + question}
                      </div>
                    </th>
                  )
                )}
              </tr>
              <tr>
                <th>Class Average</th>
                {overallSessions[props.match.params.id].questions.average.map(
                  (average, qIndex) => (
                    <th
                      key={qIndex + "average"}
                      className="expanded align-right"
                    >
                      <div>
                        {average.toFixed(2)}/
                        {overallSessions[props.match.params.id].questions.total[
                          qIndex
                        ].toFixed(2)}
                      </div>
                      <div className="bar">
                        <div
                          className="bar-value"
                          style={{
                            width:
                              (average /
                                overallSessions[props.match.params.id].questions
                                  .total[qIndex]) *
                                100 +
                              "%",
                            backgroundColor: getBackgroundColor(
                              average /
                                overallSessions[props.match.params.id].questions
                                  .total[qIndex]
                            ),
                          }}
                        ></div>
                      </div>{" "}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student: StudentInfo, index: number) => (
                <Student
                  key={index}
                  student={student}
                  sessionExpanded={props.match.params.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GradebookSession;
