import React, {
  useState,
  ReactElement,
  SyntheticEvent,
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
  StudentInfo,
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

  const [activeSearch, setActiveSearch] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sessions, setSessions]: [
    BasicSessionInfo[],
    Dispatch<SetStateAction<BasicSessionInfo[]>>
  ] = useState([] as BasicSessionInfo[]);
  const [students, setStudents]: [
    StudentInfo[],
    Dispatch<SetStateAction<StudentInfo[]>>
  ] = useState([] as StudentInfo[]);

  useEffect(() => {
    if (firstLoad) {
      getCourseGrades(state.courseId, state.token)
        .then((response) => {
          return response.json();
        })
        .then((response: CourseGradesResponse) => {
          console.log(response);
          setStudents(response.students.filter(filterStudents));
          setSessions(response.sessions);
          setDataLoaded(true);
        })
        .catch(catchError);

      setFirstLoad(false);
    }
  }, [firstLoad, dataLoaded, state.courseId, state.token]);

  // @TODO
  // REMOVE THIS IT IS ONLY FOR TESTING BAD BACKEND DATA
  const filterStudents = (student: StudentInfo): boolean => {
    return (
      student.name !== undefined &&
      student.canvasId !== undefined &&
      student.SessionGrades !== undefined
    );
  };

  const focus = () => {
    setActiveSearch(true);
  };

  const blur = (event: SyntheticEvent) => {
    if (!(event.target as HTMLInputElement).value) {
      setActiveSearch(false);
    }
  };

  const searchStudent = (event: SyntheticEvent) => {
    // setStudents(
    //   data.students.filter((student: StudentInfo) =>
    //     student.name
    //       .toLowerCase()
    //       .includes((event.target as HTMLInputElement).value.toLowerCase())
    //   )
    // );
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
                {students.map((student: StudentInfo, index: number) => (
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
