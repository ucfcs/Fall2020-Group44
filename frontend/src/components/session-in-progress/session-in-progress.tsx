import { QuestionInfo } from "../../types";
import React, { ReactElement, useContext } from "react";
import SessionProgress from "./session-progress/session-progress";
import Question from "./question/question";

import "./session-in-progress.scss";

import data from "./mock-data.json";
import PollHeader from "../session-header/session-header";
import { CORRECT_RESPONSE, RESPOND, RESPONSES } from "../../constants";
import { store } from "../../store";
import Sidebar from "./sidebar/sidebar";

const SessionInProgress = (): ReactElement => {
  const global = useContext(store) as any;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;

  const questions: QuestionInfo[] = data.questions;
  const currentQuestion = questions[questionNumber];

  const content = (): ReactElement => {
    switch (questionProgress) {
      case RESPOND:
        return (
          <Question
            questionText={currentQuestion.text}
            answers={currentQuestion.answers}
            showPercentages={false}
            questionCount={questions.length}
          />
        );
      case RESPONSES:
        return (
          <Question
            questionText={currentQuestion.text}
            answers={currentQuestion.answers}
            showPercentages={true}
            questionCount={questions.length}
          />
        );
      case CORRECT_RESPONSE:
        return (
          <Question
            questionText={currentQuestion.text}
            answers={currentQuestion.answers}
            correctAnswer={currentQuestion.correctIndex}
            showPercentages={true}
            questionCount={questions.length}
          />
        );
      default:
        return <></>;
    }
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
