import { QuestionInfo } from "../../types";
import { useState } from "react";
import PollProgress from "../poll-progress/poll-progress";
import Question from "../question/question";
import PollControls from "../poll-controls/poll-controls";

const data = require("./mock-data.json");

export const RESPOND = 0;
export const CLOSE = 1;
export const RESPONSES = 2;
export const CORRECT_RESPONSE = 3;

const PollInProgress = () => {
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
      <PollProgress progress={progress} updateProgress={updateProgress} />
      <Question
        questionText={currentQuestion.text}
        answers={currentQuestion.answers}
      />
      <PollControls
        questionCount={questions.length}
        questionNumber={questionNumber}
      />
    </div>
  );
};

export default PollInProgress;
