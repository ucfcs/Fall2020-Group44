import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import { store } from "../../store";

import "./session-header.scss";

const SessionHeader = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const clearSession = (): void => {
    dispatch({ type: "update-question-number", payload: 0 });
    dispatch({ type: "update-session-questions", payload: [] });

    // tell websocket server to end the session,
    // notifying all students
    if (state.websocket) {
      state.websocket.send(
        JSON.stringify({
          action: "endSession",
          courseId: state.courseId,
        })
      );
    }
  };

  return (
    <div className="session-header">
      {state.sessionInProgress ? (
        <img
          alt="UCF React Logo"
          src="/img/UCFReactLogoBlackBackground.png"
          onClick={() => {
            dispatch({ type: "show-exit-warning-modal" });
            clearSession();
          }}
        />
      ) : (
        <Link to="/">
          <img
            alt="UCF React Logo"
            src="/img/UCFReactLogoBlackBackground.png"
            onClick={clearSession}
          />
        </Link>
      )}

      <div className="exit-button-wrapper">
        {state.sessionInProgress ? (
          <button
            className="exit-button"
            onClick={() => {
              dispatch({ type: "show-exit-warning-modal" });
            }}
          >
            EXIT
          </button>
        ) : (
          <Link onClick={clearSession} className="exit-button" to="/">
            EXIT
          </Link>
        )}
      </div>
    </div>
  );
};

export default SessionHeader;
