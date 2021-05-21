import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
} from "react";

import { RESPOND, RESPONSES, CORRECT_RESPONSE } from "../../../constants";
import { Question } from "../../../types";
import { store } from "../../../store";

import "./session-progress.scss";

const SessionProgress = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionNumber = state.questionNumber;
  const questionProgress = state.sessionQuestions[questionNumber].progress;
  const isClosed = state.sessionQuestions[questionNumber].isClosed;

  // do this to compare objects
  // because useEffect dependency array doesn't do deep compare
  const effectDependency = JSON.stringify(state.sessionQuestions);

  useEffect(() => {
    if (
      state.sessionQuestions.every((question: Question) => question.interacted)
    ) {
      dispatch({ type: "disable-exit-warning" });
      dispatch({ type: "hide-exit-warning-modal" });
    } else {
      dispatch({ type: "enable-exit-warning" });
    }
  }, [dispatch, state.sessionQuestions, effectDependency]);

  const updateProgress = (event: SyntheticEvent): void => {
    let progress: number;
    const target = event.target as HTMLInputElement;

    if (target.tagName === "SPAN") {
      const parent = target.parentElement as HTMLInputElement;

      progress = parseInt(parent.value);
    } else {
      progress = parseInt(target.value);
    }

    const newQuestions = state.sessionQuestions;
    newQuestions[questionNumber].progress = progress;

    if (progress > 0) {
      newQuestions[questionNumber].interacted = true;
    }

    dispatch({
      type: "update-session-questions",
      payload: newQuestions,
    });
  };

  // toggle Stop Responses
  const toggleClosed = (): void => {
    // send students start- or endQuestion ws message
    if (!isClosed) {
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "endQuestion",
            courseId: state.courseId,
          })
        );
      }
    } else {
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "startQuestion",
            courseId: state.courseId,
            question: state.sessionQuestions[questionNumber],
          })
        );
      }
    }

    //  update the isClosed attribute of the current Question
    const newQuestions = state.sessionQuestions;
    newQuestions[questionNumber].isClosed = !isClosed;
    newQuestions[questionNumber].interacted = true;

    dispatch({ type: "update-session-questions", payload: newQuestions });
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
            {props.responseCount} / {props.classSize} Responses
          </span>

          <progress max={props.classSize} value={props.responseCount}>
            {props.responseCount} / {props.classSize} Responses
          </progress>
        </div>
      </div>

      <button
        onClick={toggleClosed}
        className={`close-button ${isClosed ? "closed" : ""}`}
      >
        {isClosed ? (
          <img src="/img/lock.svg" alt="" />
        ) : (
          <img src="/img/unlock.svg" alt="" />
        )}

        {isClosed ? "Open Responses" : "Stop Responses"}
      </button>
    </div>
  );
};

interface Props {
  classSize: number;
  responseCount: number;
}

export default SessionProgress;
