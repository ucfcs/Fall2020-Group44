import { useState } from "react";
import PollProgress from "../poll-progress/poll-progress";

export const RESPOND = 0;
export const CLOSE = 1;
export const RESPONSES = 2;
export const CORRECT_RESPONSE = 3;

const PollInProgress = () => {
  const [progress, setProgress] = useState(RESPOND);

  const updateProgress = (value: number): void => {
    if (value > progress) {
      setProgress(value);
    }
  };

  return (
    <div className="poll-in-progress">
      <PollProgress progress={progress} updateProgress={updateProgress} />
    </div>
  );
};

export default PollInProgress;
