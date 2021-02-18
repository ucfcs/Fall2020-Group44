import { QuestionInfo } from "../../types";
import React, { ReactElement, useContext } from "react";
import SessionProgress from "./session-progress/session-progress";
import Question from "./question/question";
import SessionControls from "./session-controls/session-controls";

import "./session-in-progress.scss";

import data from "./mock-data.json";
import PollHeader from "../poll-header/poll-header";
import Close from "./close/close";
import { CLOSE, CORRECT_RESPONSE, RESPOND, RESPONSES } from "../../constants";
import { store } from "../../store";

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
          />
        );
      case CLOSE:
        return <Close />;
      case RESPONSES:
        return (
          <Question
            questionText={currentQuestion.text}
            answers={currentQuestion.answers}
            showPercentages={true}
          />
        );
      case CORRECT_RESPONSE:
        return (
          <Question
            questionText={currentQuestion.text}
            answers={currentQuestion.answers}
            correctAnswer={currentQuestion.correctIndex}
            showPercentages={false}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="session-in-progress">
      <div className="content">
        <PollHeader />

        <SessionProgress />

        {content()}
      </div>

      <SessionControls questionCount={questions.length} />
    </div>
  );
};

export default SessionInProgress;
