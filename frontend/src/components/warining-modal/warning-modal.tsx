import React, { useContext, ReactElement } from "react";
import { Link } from "react-router-dom";

import { store } from "../../store";

import Modal from "../modal/modal";

import "./warning-modal.scss";
import { postSessionGrades } from "../../util/api";
import { Question } from "../../types";

const WarningModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const endSession = () => {
    dispatch({ type: "disable-exit-warning" });
    clearSession();
    closeWarningModal();
  };

  const closeWarningModal = () => {
    dispatch({ type: "hide-exit-warning-modal" });
  };

  const clearSession = (): void => {
    postSessionGrades(
      state.courseId,
      state.sessionId,
      state.jwt,
      unansweredQuestionIds()
    ).catch((error) => console.log(error));

    dispatch({ type: "update-question-number", payload: 0 });
    dispatch({ type: "update-session-questions", payload: [] });
    dispatch({ type: "update-session-id", payload: -1 });

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

  const unansweredQuestionIds = (): number[] => {
    const unanswered: number[] = [];
    state.sessionQuestions.forEach((question: Question) => {
      if (question.interacted == false) {
        if (question.id) {
          unanswered.push(question.id);
        }
      }
    });
    return unanswered;
  };

  const unansweredQuestionNums = (): number[] => {
    const unanswered: number[] = [];
    state.sessionQuestions.forEach((question: Question, index: number) => {
      if (question.interacted == false) {
        unanswered.push(index + 1);
      }
    });
    return unanswered;
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
          <div className="warning-message">
            <p>
              The session is incomplete because the following questions have
              open responses:
            </p>
            <ul>
              {unansweredQuestionNums().map((question: number) => (
                <li key={question}>Question {question}</li>
              ))}
            </ul>
            <p>
              These questions will not record responses in the gradebook. Are
              you sure you want to end the session?
            </p>
          </div>
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
