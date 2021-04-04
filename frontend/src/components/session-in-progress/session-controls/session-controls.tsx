import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import { CORRECT_RESPONSE, RESPOND, RESPONSES } from "../../../constants";
import { store } from "../../../store";
import "./session-controls.scss";

const SessionControls = (props: SessionControlsProps): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionNumber = state.questionNumber;
  const questionProgress = props.questionProgress;

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

  const goForward = (): void => {
    if (questionProgress < CORRECT_RESPONSE) {
      const newQuestions = state.sessionQuestions;
      newQuestions[questionNumber].progress = questionProgress + 1;
      dispatch({
        type: "update-session-questions",
        payload: newQuestions,
      });
    } else {
      nextQuestion();
    }
  };

  const goBack = (): void => {
    if (questionProgress > RESPOND) {
      const newQuestions = state.sessionQuestions;
      newQuestions[questionNumber].progress = questionProgress - 1;
      dispatch({
        type: "update-session-questions",
        payload: newQuestions,
      });
    } else {
      previousQuestion();
    }
  };

  const nextQuestion = (): void => {
    // on the final question
    if (questionNumber >= props.questionCount - 1) {
      // this would make an api call to record what happened since it is the end of the session
      dispatch({ type: "update-question-number", payload: 0 });
      dispatch({ type: "update-session-questions", payload: [] });

      // notify students the session has ended
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "endSession",
            courseId: state.courseId,
          })
        );
      }
    } else {
      const newQuestions = state.sessionQuestions;
      newQuestions[questionNumber + 1].progress = RESPOND;
      dispatch({
        type: "update-session-questions",
        payload: newQuestions,
      });
      dispatch({ type: "update-question-number", payload: questionNumber + 1 });
    }
  };

  const previousQuestion = (): void => {
    if (questionNumber > 0) {
      const newQuestions = state.sessionQuestions;
      newQuestions[questionNumber - 1].progress = RESPOND;
      dispatch({
        type: "update-session-questions",
        payload: newQuestions,
      });
      dispatch({
        type: "update-question-number",
        payload: state.questionNumber - 1,
      });
    }
  };

  return (
    <div className="session-controls">
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
  );
};

interface SessionControlsProps {
  questionCount: number;
  questionProgress: number;
}

export default SessionControls;
