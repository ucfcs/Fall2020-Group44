import React, { useContext, ReactElement } from "react";
import { Link } from "react-router-dom";
import { store } from "../../store";
import Modal from "../modal/modal";
import "./warning-modal.scss";

const WarningModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const endSession = () => {
    dispatch({ type: "disable-exit-warning" });
    closeWarningModal();
  };

  const closeWarningModal = () => {
    dispatch({ type: "hide-exit-warning-modal" });
  };

  const clearSession = (): void => {
    if (!state.sessionInProgress) {
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
    }
  };

  return (
    <Modal>
      <div className="warning-module">
        <div className="warning-header">
          <button
            type="reset"
            className="exit"
            tabIndex={0}
            onClick={closeWarningModal}
          >
            ×
          </button>

          <span className="header-title">Warning</span>
        </div>
        <div className="warning-body">
          <p className="warning-message">
            There are incomplete question. Are you sure you want to end the
            session?
          </p>
        </div>

        <div className="buttons">
          <button
            type="reset"
            className="cancel-button"
            tabIndex={0}
            onClick={closeWarningModal}
          >
            Cancel
          </button>

          <Link onClick={endSession} className="save-button" to="/">
            Confirm
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default WarningModal;
