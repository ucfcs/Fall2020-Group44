import React, {
  useState,
  ReactElement,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import Student from "./student";
import {
  BasicSessionInfo,
  ClassAverageInfo,
  CourseGradesResponse,
  StudentSessionInfo,
} from "../../types";

import "./gradebook.scss";

import HomeHeader from "../home-header/home-header";
import { store } from "../../store";
import { catchError, getCourseGrades } from "../../util/api";

const RED = 0.5;
const YELLOW = 0.75;

const Gradebook = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [classAverage, setClassAverage]: [
    ClassAverageInfo,
    Dispatch<SetStateAction<ClassAverageInfo>>
  ] = useState<ClassAverageInfo>({ points: 0, maxPoints: 0 });
  const [sessions, setSessions]: [
    BasicSessionInfo[],
    Dispatch<SetStateAction<BasicSessionInfo[]>>
  ] = useState<BasicSessionInfo[]>([]);
  const [students, setStudents]: [
    StudentSessionInfo[],
    Dispatch<SetStateAction<StudentSessionInfo[]>>
  ] = useState<StudentSessionInfo[]>([]);

  useEffect(() => {
    if (firstLoad) {
      getCourseGrades(state.courseId, state.jwt)
        .then((response) => {
          return response.json();
        })
        .then((response: CourseGradesResponse): void => {
          setStudents(response.students.filter(filterStudents));
          setSessions(response.sessions);
          setClassAverage(response.classAverage);
          setDataLoaded(true);
        })
        .catch(catchError);

      setFirstLoad(false);
    }
  }, [firstLoad, dataLoaded, state.courseId, state.jwt]);

  // @TODO
  // REMOVE THIS IT IS ONLY FOR TESTING BAD BACKEND DATA
  const filterStudents = (student: StudentSessionInfo): boolean => {
    return (
      student.name !== undefined &&
      student.canvasId !== undefined &&
      student.SessionGrades !== undefined
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

      {!dataLoaded ? (
        <p>Loading...</p>
      ) : (
        <div className="gradebook">
          <div className="grade-navigation">
            <button className="export-button" onClick={exportToCanvas}>
              Export to Webcourses
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="header-text first-column">Student</th>
                  <th className="header-text">Totals</th>

                  {sessions.map((session: BasicSessionInfo, sIndex: number) => (
                    <th key={sIndex} className="session-name">
                      <div className="header-text">{session.name}</div>
                      <Link className="expand" to={`/gradebook/${session.id}`}>
                        {"View >"}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="averages">
                  <td className="first-column averages-text">Class Average</td>
                  <td className="align-right averages-text">
                    <div>
                      {classAverage.points.toFixed(2)} /{" "}
                      {classAverage.maxPoints.toFixed(2)}
                    </div>
                    <div className="bar">
                      <div
                        className="bar-value"
                        style={{
                          width:
                            (classAverage.points / classAverage.maxPoints) *
                              100 +
                            "%",
                          backgroundColor: getBackgroundColor(
                            classAverage.points / classAverage.maxPoints
                          ),
                        }}
                      ></div>
                    </div>
                  </td>
                  {sessions.map((session: BasicSessionInfo, sIndex: number) => {
                    const average = session.SessionGrades[0].avgPoints;
                    const max = session.SessionGrades[0].maxPoints;
                    return (
                      <td
                        key={sIndex}
                        className="session-average align-right averages-text"
                      >
                        <div>
                          {average.toFixed(2)} / {max.toFixed(2)}
                        </div>
                        <div className="bar">
                          <div
                            className="bar-value"
                            style={{
                              width: (average / max) * 100 + "%",
                              backgroundColor: getBackgroundColor(
                                average / max
                              ),
                            }}
                          ></div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {students.map((student: StudentSessionInfo, index: number) => (
                  <Student key={index} student={student} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Gradebook;
