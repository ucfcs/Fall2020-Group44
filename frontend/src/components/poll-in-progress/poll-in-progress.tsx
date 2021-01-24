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

  const questionCount: number = data.questionCount;
  const QuestionNumber: number = data.QuestionNumber;

  const updateProgress = (value: number): void => {
    if (value > progress) {
      setProgress(value);
    }
  };

  return (
    <div className="poll-in-progress">
      <PollProgress progress={progress} updateProgress={updateProgress} />
      <Question questionText={"Test"} answers={["Test 1", "Test 2"]} />
      <PollControls questionCount={questionCount} questionNumber={QuestionNumber} />
    </div>
  );
};

export default PollInProgress;
