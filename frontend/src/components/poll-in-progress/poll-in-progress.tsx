import { QuestionInfo } from "../../types";
import React, { ReactElement, useState } from "react";
import PollProgress from "./poll-progress/poll-progress";
import Question from "./question/question";
import PollControls from "./poll-controls/poll-controls";

import "./poll-in-progress.scss";

import data from "./mock-data.json";
import PollHeader from "../poll-header/poll-header";

export const RESPOND = 0;
export const CLOSE = 1;
export const RESPONSES = 2;
export const CORRECT_RESPONSE = 3;

const PollInProgress = (): ReactElement => {
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
    <div className="poll-in-progress">
      <div className="content">
        <PollHeader />

        <PollProgress progress={progress} updateProgress={updateProgress} />

        <Question
          questionText={currentQuestion.text}
          answers={currentQuestion.answers}
        />
      </div>

      <PollControls
        questionCount={questions.length}
        questionNumber={questionNumber}
      />
    </div>
  );
};

export default PollInProgress;
