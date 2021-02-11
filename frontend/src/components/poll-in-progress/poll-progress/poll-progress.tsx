import React, { ReactElement, SyntheticEvent } from "react";
import {
  RESPOND,
  CLOSE,
  RESPONSES,
  CORRECT_RESPONSE,
} from "../poll-in-progress";

import "./poll-progress.scss";

import data from "./mock-data.json";

const PollProgress = (props: PollProgressProps): ReactElement => {
  const classSize: number = data.classSize;
  const responseCount: number = data.responseCount;

  const updateProgress = (event: SyntheticEvent): void => {
    props.updateProgress(~~(event.target as HTMLInputElement).value);
  };

  return (
    <div className="poll-progress">
      <div className="progress-control">
        <button
          value={RESPOND}
          className={props.progress >= RESPOND ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">1</span>Respond
        </button>

        <div className={props.progress >= CLOSE ? "active line" : "line"} />

        <button
          value={CLOSE}
          className={props.progress >= CLOSE ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">2</span>Close Poll
        </button>

        <div className={props.progress >= RESPONSES ? "active line" : "line"} />

        <button
          value={RESPONSES}
          className={props.progress >= RESPONSES ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">3</span>View Responses
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
          <span className="order">4</span>Correct Response
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

      <hr />
    </div>
  );
};

interface PollProgressProps {
  progress: number;
  updateProgress: (value: number) => void;
}

export default PollProgress;
