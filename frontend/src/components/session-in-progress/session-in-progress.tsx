import { QuestionInfo } from "../../types";
import React, { ReactElement, useState } from "react";
import SessionProgress from "./session-progress/session-progress";
import Question from "./question/question";
import SessionControls from "./session-controls/session-controls";

import "./session-in-progress.scss";

import data from "./mock-data.json";
import PollHeader from "../poll-header/poll-header";

export const RESPOND = 0;
export const CLOSE = 1;
export const RESPONSES = 2;
export const CORRECT_RESPONSE = 3;

const SessionInProgress = (): ReactElement => {
  const [progress, setProgress] = useState(RESPOND);
  const [questionNumber, setQuestionNumber] = useState(0);

  const questions: QuestionInfo[] = data.questions;
  const currentQuestion = questions[questionNumber];

  const updateProgress = (value: number): void => {
    if (value > progress) {
      setProgress(value);
    }
  };

  return (
    <div className="session-in-progress">
      <div className="content">
        <PollHeader />

        <SessionProgress progress={progress} updateProgress={updateProgress} />

        <Question
          questionText={currentQuestion.text}
          answers={currentQuestion.answers}
        />
      </div>

      <SessionControls
        questionCount={questions.length}
        questionNumber={questionNumber}
      />
    </div>
  );
};

export default SessionInProgress;
