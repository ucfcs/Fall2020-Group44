import { Question, QuestionOption } from "../../types";
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SessionProgress from "./session-progress/session-progress";
import QuestionComponent from "./question/question";

import "./session-in-progress.scss";

import PollHeader from "../session-header/session-header";
import { store } from "../../store";
import Sidebar from "./sidebar/sidebar";

function usePrevious(value: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const SessionInProgress = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;
  const prevQuestionNumber = usePrevious(questionNumber);
  const isClosed = state.sessionQuestions[questionNumber].isClosed;

  const questions: Question[] = state.sessionQuestions;
  const currentQuestion = questions[questionNumber];

  // response bar
  const [classSize, setClassSize] = useState<number>(state.classSize);
  const [responseCount, setResponseCount] = useState<number>(
    state.sessionQuestions[questionNumber].responseCount
  );

  // everytime the question changes, update the reponse count for the previous
  // question before getting the response count of the next question
  useEffect(() => {
    if (prevQuestionNumber !== undefined) {
      updateResponses(prevQuestionNumber, responseCount).then(() => {
        setResponseCount(state.sessionQuestions[questionNumber].responseCount);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber]);

  if (state.websocket) {
    state.websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message);

      switch (message.action) {
        case "studentSubmittedNew":
          if (!isClosed) {
            setResponseCount(responseCount + 1);
            // set response for that question option
            const newQuestions = state.sessionQuestions;
            newQuestions[questionNumber].QuestionOptions.forEach(
              (option: QuestionOption) => {
                if (option.id == message.payload.questionOptionId) {
                  if (typeof option.responseCount === "number")
                    option.responseCount++;
                }
              }
            );
            dispatch({
              type: "update-session-questions",
              payload: newQuestions,
            });
          }
          break;
        case "studentSubmittedUpdate":
          if (!isClosed) {
            // set response for that question option
            const newQuestions = state.sessionQuestions;
            newQuestions[questionNumber].QuestionOptions.forEach(
              (option: QuestionOption) => {
                if (option.id == message.payload.new) {
                  if (typeof option.responseCount === "number")
                    option.responseCount++;
                } else if (option.id == message.payload.previous) {
                  if (typeof option.responseCount === "number")
                    option.responseCount--;
                }
              }
            );
            dispatch({
              type: "update-session-questions",
              payload: newQuestions,
            });
          }
          break;
        case "studentLeft":
          if (classSize > 0) setClassSize(classSize - 1);
          break;
        case "studentJoined":
          setClassSize(classSize + 1);
          break;
      }
    };
  }

  // dispatch the updated response count for a question so
  // that it persists
  const updateResponses = async (questionNum: number, count: number) => {
    const newQuestions = state.sessionQuestions;
    newQuestions[questionNum].responseCount = count;
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  useEffect(() => {
    if (state.websocket) {
      state.websocket.send(
        JSON.stringify({
          action: "startQuestion",
          courseId: state.courseId,
          question: currentQuestion,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const content = (): ReactElement => {
    return (
      <QuestionComponent
        questionText={currentQuestion.question}
        answers={currentQuestion.QuestionOptions}
        showPercentages={questionProgress > 0}
        questionCount={questions.length}
        questionProgress={questionProgress}
        responseTotal={responseCount}
      />
    );
  };

  return (
    <div className="session-in-progress">
      <PollHeader />

      {/* <div className="grid"> */}
      <SessionProgress classSize={classSize} responseCount={responseCount} />

      <Sidebar questionCount={questions.length} />

      <div className="content">{content()}</div>
      {/* </div> */}
    </div>
  );
};

interface Option extends QuestionOption {
  id: number;
  questionId: number;
  responseCount: number;
}

export default SessionInProgress;
