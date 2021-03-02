import React, { ReactElement, SyntheticEvent, useContext } from "react";
import { Link } from "react-router-dom";
import { CORRECT_RESPONSE, RESPOND, RESPONSES } from "../../../constants";
import { store } from "../../../store";
import "./session-controls.scss";

const SessionControls = (props: SessionControlsProps): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;

  const buttons: number[] = [];
  let nextStage: string;

  switch (questionProgress) {
    case RESPOND:
      nextStage = "View Responses";
      break;
    case RESPONSES:
      nextStage = "Correct Response";
      break;
    case CORRECT_RESPONSE:
      nextStage = "Next Question";
      break;
    default:
      nextStage = "Next";
  }

  for (let i = 0; i < props.questionCount; i++) {
    buttons.push(i + 1);
  }

  const close = (): void => {
    if (!state.closedQuestions.has(questionNumber)) {
      dispatch({ type: "close-question", payload: questionNumber });
    }
  };

  const goForward = (): void => {
    if (questionProgress < CORRECT_RESPONSE) {
      dispatch({
        type: "update-question-progress",
        payload: questionProgress + 1,
      });
    } else {
      nextQuestion();
    }
  };

  const goBack = (): void => {
    if (questionProgress > RESPOND) {
      dispatch({
        type: "update-question-progress",
        payload: questionProgress - 1,
      });
    } else {
      previousQuestion();
    }
  };

  const nextQuestion = (): void => {
    if (questionNumber >= props.questionCount - 1) {
      // this would make an api call to record what happened since it is the end of the session
      dispatch({ type: "update-question-number", payload: 0 });
      dispatch({ type: "update-question-progress", payload: RESPOND });
      dispatch({ type: "open-questions" });
    } else {
      dispatch({ type: "update-question-number", payload: questionNumber + 1 });
      dispatch({ type: "update-question-progress", payload: RESPOND });
    }
  };

  const previousQuestion = (): void => {
    if (questionNumber > 0) {
      dispatch({
        type: "update-question-number",
        payload: state.questionNumber - 1,
      });
      dispatch({ type: "update-question-progress", payload: RESPOND });
    }
  };

  const pickQuestion = (event: SyntheticEvent): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    let num: number;

    if (target.tagName === "IMG") {
      num = parseInt((target.parentElement as HTMLInputElement).value);
    } else {
      num = parseInt(target.value);
    }

    if (num !== state.questionNumber) {
      dispatch({ type: "update-question-number", payload: num });
      dispatch({ type: "update-question-progress", payload: RESPOND });
    }
  };

  return (
    <div className="session-controls">
      <div className="question-nav">
        {buttons.map((number: number, index: number) => (
          <button
            key={index}
            className={`question-nav-button ${
              index === questionNumber ? "active" : ""
            }`}
            value={number - 1}
            onClick={pickQuestion}
          >
            <img src="/img/logo.svg" alt="" />Q{number}{" "}
          </button>
        ))}
      </div>

      <div className="control-buttons">
        <button
          onClick={close}
          className={`control-button close-button ${
            state.closedQuestions.has(questionNumber) ? "closed" : ""
          }`}
        >
          Close
        </button>

        <button className="control-button back-button" onClick={goBack}>
          Back
        </button>

        {/* This next bit is ugly. What it does is make sure that on the last question
            the skip button turns into End Session, and the Next button will go away on
            the last stage of the last question. */}

        {questionProgress < CORRECT_RESPONSE ? (
          <button className="next-button control-button" onClick={goForward}>
            {nextStage}
          </button>
        ) : questionNumber < props.questionCount - 1 ? (
          <button className="next-button control-button" onClick={goForward}>
            {nextStage}
          </button>
        ) : null}

        {questionNumber < props.questionCount - 1 ? (
          <button className="skip-button control-button" onClick={nextQuestion}>
            Skip to Next Question
          </button>
        ) : (
          <Link
            onClick={nextQuestion}
            className="control-button skip-button link-button"
            to="/"
          >
            End Session
          </Link>
        )}
      </div>
    </div>
  );
};

interface SessionControlsProps {
  questionCount: number;
}

export default SessionControls;
