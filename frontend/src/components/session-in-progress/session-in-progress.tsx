import { Question, QuestionOption } from "../../types";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import SessionProgress from "./session-progress/session-progress";
import QuestionComponent from "./question/question";

import "./session-in-progress.scss";

import PollHeader from "../session-header/session-header";
import { store } from "../../store";
import Sidebar from "./sidebar/sidebar";

const SessionInProgress = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionNumber = state.questionNumber;
  const isClosed = state.sessionQuestions[questionNumber].isClosed;
  const questionProgress = state.sessionQuestions[questionNumber].progress;

  const questions: Question[] = state.sessionQuestions;
  const currentQuestion = questions[questionNumber];

  // response bar
  const [classSize, setClassSize] = useState<number>(state.classSize);

  // websocket listener for the session in progress
  if (state.websocket) {
    state.websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message);

      switch (message.action) {
        case "studentSubmittedNew":
          if (!isClosed) {
            // set response for that question option
            const newQuestions = state.sessionQuestions;
            newQuestions[questionNumber].QuestionOptions.forEach(
              (option: QuestionOption) => {
                // increment the response count of the QuestionOption
                // and increment the question's total repsonse count
                if (option.id == message.payload.questionOptionId) {
                  if (typeof option.responseCount === "number") {
                    option.responseCount++;
                    newQuestions[questionNumber].responseCount++;
                  }
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
                // increment the response count of the new QuestionOption
                if (option.id == message.payload.new) {
                  if (typeof option.responseCount === "number")
                    option.responseCount++;
                }
                // decrement the response count of the old QuestionOption
                else if (option.id == message.payload.previous) {
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

  // each time the question changes, emit start question to the students
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
        responseTotal={state.sessionQuestions[questionNumber].responseCount}
      />
    );
  };

  return (
    <div className="session-in-progress">
      <PollHeader />

      {/* <div className="grid"> */}
      <SessionProgress
        classSize={classSize}
        responseCount={state.sessionQuestions[questionNumber].responseCount}
      />

      <Sidebar questionCount={questions.length} />

      <div className="content">{content()}</div>
      {/* </div> */}
    </div>
  );
};

export default SessionInProgress;
