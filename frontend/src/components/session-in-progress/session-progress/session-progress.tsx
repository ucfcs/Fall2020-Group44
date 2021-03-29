import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { RESPOND, RESPONSES, CORRECT_RESPONSE } from "../../../constants";

import "./session-progress.scss";

import { store } from "../../../store";

const SessionProgress = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;
  const isClosed = state.closedQuestions.has(questionNumber);

  // response bar
  const [classSize, setClassSize] = useState<number>(state.classSize);
  const [responseCount, setResponseCount] = useState<number>(0);

  //todo: response count needs to be reset for each quesiton, but
  // probably also saved for already presented questions?

  if (state.websocket) {
    state.websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message);

      switch (message.action) {
        case "studentSubmitted":
          setResponseCount(responseCount + 1);
          break;
        case "studentLeft":
          setClassSize(classSize - 1);
          break;
        case "studentJoined":
          console.log("studentJoined");
          setClassSize(classSize + 1);
          break;
      }
    };
  }

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

  const close = (): void => {
    if (!state.closedQuestions.has(questionNumber)) {
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "endQuestion",
            courseId: state.courseId,
          })
        );
      }
      dispatch({ type: "close-question", payload: questionNumber });
    }
  };

  return (
    <div className="session-progress">
      <div className="progress-info">
        <div className="progress-control">
          <button
            value={RESPOND}
            className={`control-button ${
              questionProgress >= RESPOND ? "active" : ""
            }`}
            onClick={updateProgress}
          >
            <span className="order">1</span>Respond
          </button>

          <div
            className={questionProgress >= RESPONSES ? "active line" : "line"}
          />

          <button
            value={RESPONSES}
            className={`control-button ${
              questionProgress >= RESPONSES ? "active" : ""
            }`}
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
            className={`control-button ${
              questionProgress >= CORRECT_RESPONSE ? "active" : ""
            }`}
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
      </div>

      <button
        onClick={close}
        className={`close-button ${isClosed ? "closed" : ""}`}
      >
        {isClosed ? (
          <img src="/img/lock.svg" alt="" />
        ) : (
          <img src="/img/unlock.svg" alt="" />
        )}
        {isClosed ? "Responses Stopped" : "Stop Responses"}
      </button>
    </div>
  );
};

export default SessionProgress;
