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
  QuestionGradeInfo,
  SessionGradesResponse,
  StudentQuestionInfo,
} from "../../types";

import "./session.scss";

import HomeHeader from "../home-header/home-header";
import { store } from "../../store";
import { catchError, getSessionGrades } from "../../util/api";

const GradebookSession = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [questions, setQuestions]: [
    QuestionGradeInfo[],
    Dispatch<SetStateAction<QuestionGradeInfo[]>>
  ] = useState<QuestionGradeInfo[]>([]);
  const [students, setStudents]: [
    StudentQuestionInfo[],
    Dispatch<SetStateAction<StudentQuestionInfo[]>>
  ] = useState<StudentQuestionInfo[]>([]);

  useEffect(() => {
    if (firstLoad) {
      getSessionGrades(state.courseId, props.match.params.id, state.token)
        .then((response) => {
          return response.json();
        })
        .then((response: SessionGradesResponse) => {
          setStudents(response.students.filter(filterStudents));
          setQuestions(response.questions);
          setDataLoaded(true);
        })
        .catch(catchError);

      setFirstLoad(false);
    }
  }, [
    firstLoad,
    dataLoaded,
    state.courseId,
    state.token,
    props.match.params.id,
  ]);

  // @TODO
  // REMOVE THIS IT IS ONLY FOR TESTING BAD BACKEND DATA
  const filterStudents = (student: StudentQuestionInfo): boolean => {
    return (
      student.name !== undefined &&
      student.canvasId !== undefined &&
      student.QuestionGrades !== undefined
    );
  };

  const exportToCanvas = (): void => {
    dispatch({ type: "open-export-modal" });
  };

  return (
    <>
      <HomeHeader />

      {!dataLoaded ? (
        <p>Loading...</p>
      ) : (
        <div className="session">
          <div className="grade-navigation">
            <div className="session-info-wrapper">
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

                  {questions.map(
                    (
                      question: QuestionGradeInfo,
                      qIndex: number
                    ): ReactElement => (
                      <th key={qIndex + "question"} className="expanded">
                        <div className="question-name">{question.title}</div>
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {students.map((student: StudentQuestionInfo, index: number) => (
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

interface Props {
  match: {
    params: {
      [key: string]: number;
    };
  };
}

export default GradebookSession;
