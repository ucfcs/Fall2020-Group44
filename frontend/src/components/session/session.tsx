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
  ClassAverageInfo,
} from "../../types";

import "./session.scss";

import HomeHeader from "../home-header/home-header";
import { store } from "../../store";
import { catchError, getSessionGrades } from "../../util/api";

const RED = 0.5;
const YELLOW = 0.75;

const GradebookSession = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [sessionName, setSessionName] = useState<string>("");
  const [classAverage, setClassAverage]: [
    ClassAverageInfo,
    Dispatch<SetStateAction<ClassAverageInfo>>
  ] = useState<ClassAverageInfo>({ points: 0, maxPoints: 0 });
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
      getSessionGrades(state.courseId, props.match.params.id, state.jwt)
        .then((response) => {
          return response.json();
        })
        .then((response: SessionGradesResponse) => {
          setStudents(response.students);
          setSessionName(response.session.name);
          setClassAverage(response.classAverage);
          setQuestions(response.session.Questions);
          setDataLoaded(true);
        })
        .catch(catchError);

      setFirstLoad(false);
    }
  }, [firstLoad, dataLoaded, state.courseId, state.jwt, props.match.params.id]);

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

            <div className="session-name">{sessionName}</div>

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

                  {questions.map(
                    (
                      question: QuestionGradeInfo,
                      qIndex: number
                    ): ReactElement => (
                      <th key={qIndex + "question"} className="expanded">
                        <div className="header-text question-name">
                          {question.title}
                        </div>
                      </th>
                    )
                  )}
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
                  {questions.map(
                    (question: QuestionGradeInfo, sIndex: number) => {
                      const average = question.QuestionGrades[0].avgPoints;
                      const max = question.QuestionGrades[0].maxPoints;
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
                    }
                  )}
                </tr>
                {students.map((student: StudentQuestionInfo, index: number) => (
                  <Student
                    key={index}
                    student={student}
                    questions={questions}
                  />
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
