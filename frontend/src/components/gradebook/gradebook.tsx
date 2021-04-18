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
  CourseGradesResponse,
  StudentSessionInfo,
} from "../../types";

import "./gradebook.scss";

import HomeHeader from "../home-header/home-header";
import { store } from "../../store";
import { catchError, getCourseGrades } from "../../util/api";

const Gradebook = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
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
        .then((response: CourseGradesResponse) => {
          setStudents(response.students.filter(filterStudents));
          setSessions(response.sessions);
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
                  <th>Student</th>

                  {sessions.map((session: BasicSessionInfo, sIndex: number) => (
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
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
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
