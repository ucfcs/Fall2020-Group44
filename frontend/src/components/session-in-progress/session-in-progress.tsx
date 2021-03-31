import { Question } from "../../types";
import React, { ReactElement, useContext, useEffect } from "react";
import SessionProgress from "./session-progress/session-progress";
import QuestionComponent from "./question/question";

import "./session-in-progress.scss";

import PollHeader from "../session-header/session-header";
import { store } from "../../store";
import Sidebar from "./sidebar/sidebar";

const SessionInProgress = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;

  const questions: Question[] = state.sessionQuestions;
  const currentQuestion = questions[questionNumber];

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
      />
    );
  };

  return (
    <div className="session-in-progress">
      <PollHeader />

      {/* <div className="grid"> */}
      <SessionProgress />

      <Sidebar questionCount={questions.length} />

      <div className="content">{content()}</div>
      {/* </div> */}
    </div>
  );
};

export default SessionInProgress;
