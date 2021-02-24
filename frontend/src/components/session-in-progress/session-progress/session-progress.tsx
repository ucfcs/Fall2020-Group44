import React, { ReactElement, SyntheticEvent, useContext } from "react";
import { RESPOND, RESPONSES, CORRECT_RESPONSE } from "../../../constants";

import "./session-progress.scss";

import data from "./mock-data.json";
import { store } from "../../../store";

const SessionProgress = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionProgress = state.questionProgress;

  const classSize: number = data.classSize;
  const responseCount: number = data.responseCount;

  const updateProgress = (event: SyntheticEvent): void => {
    let progress: number;
    const target = event.target as HTMLInputElement;

    if (target.tagName === "SPAN") {
      const parent = target.parentElement as HTMLInputElement;
      progress = parseInt(parent.value);
    } else {
      progress = parseInt(target.value);
    }

    dispatch({
      type: "update-question-progress",
      payload: progress,
    });
  };

  return (
    <div className="session-progress">
      <div className="progress-control">
        <button
          value={RESPOND}
          className={questionProgress >= RESPOND ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">1</span>Respond
        </button>

        <div
          className={questionProgress >= RESPONSES ? "active line" : "line"}
        />

        <button
          value={RESPONSES}
          className={questionProgress >= RESPONSES ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">2</span>View Responses
        </button>

        <div
          className={
            questionProgress >= CORRECT_RESPONSE ? "active line" : "line"
          }
        />

        <button
          value={CORRECT_RESPONSE}
          className={questionProgress >= CORRECT_RESPONSE ? "active" : ""}
          onClick={updateProgress}
        >
          <span className="order">3</span>Correct Response
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

export default SessionProgress;
