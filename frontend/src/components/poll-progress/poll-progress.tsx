import {
  RESPOND,
  CLOSE,
  RESPONSES,
  CORRECT_RESPONSE
} from "../poll-in-progress/poll-in-progress";

import "./poll-progress.scss";

const data = require("./mock-data.json");

const PollProgress = (props: PollProgressProps) => {
  const classSize: number = data.classSize;
  let responseCount: number = data.responseCount;

  const updateProgress = (event: any): void => {
    props.updateProgress(event.target.value);
  };

  return (
    <div className="poll-progress">
      <div className="progress-control">
        <button
          value={RESPOND}
          className={props.progress >= RESPOND ? "active" : ""}
          onClick={updateProgress}
        >
          Respond
        </button>

        <div className={props.progress >= CLOSE ? "active line" : "line"} />

        <button
          value={CLOSE}
          className={props.progress >= CLOSE ? "active" : ""}
          onClick={updateProgress}
        >
          Close Poll
        </button>

        <div className={props.progress >= RESPONSES ? "active line" : "line"} />

        <button
          value={RESPONSES}
          className={props.progress >= RESPONSES ? "active" : ""}
          onClick={updateProgress}
        >
          View Responses
        </button>

        <div
          className={
            props.progress >= CORRECT_RESPONSE ? "active line" : "line"
          }
        />

        <button
          value={CORRECT_RESPONSE}
          className={props.progress >= CORRECT_RESPONSE ? "active" : ""}
          onClick={updateProgress}
        >
          Correct Response
        </button>
      </div>

      <div className="progress-bar">
        <span>
          {responseCount} / {classSize} Responses
        </span>

        <progress max={classSize} value={responseCount}>
          {responseCount} / {classSize} Responses
        </progress>
      </div>
    </div>
  );
};

interface PollProgressProps {
  progress: number;
  updateProgress: any;
}

export default PollProgress;
