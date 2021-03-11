import React, { ReactElement, useContext } from "react";
import { Session } from "../../types";
import { store } from "../../store";

import data from "./mock-data.json";

import "./export-modal.scss";

const ExportModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const sessions: Session[] = data.overallSessions;

  const cancel = (): void => {
    dispatch({ type: "close-export-modal" });
  };

  const exportGrades = (): void => {
    dispatch({ type: "close-export-modal" });
  };

  return (
    <form className="export-modal">
      <div className="export-header">
        <h3>Export to Webcourses</h3>

        <button className="exit-button" onClick={cancel}>
          X
        </button>
      </div>

      <div className="session-list">
        <div className="labels">
          <p>Session</p>

          <p>Date</p>
        </div>

        {sessions.map(
          (session: Session, index: number): ReactElement => (
            <div key={index} className="session-box">
              <div>
                <input id={`question-${index}`} type="checkbox" />

                <label htmlFor={`question-${index}`}>{session.name}</label>
              </div>

              <p>{session.date}</p>
            </div>
          )
        )}
      </div>

      <div className="metadata">
        <div className="assignment-input">
          <label htmlFor="export-assignment-name">Assignment Name:</label>

          <input id="export-assignment-name" placeholder="Assignment 1" />
        </div>

        <div>
          <label htmlFor="export-assignment-points">Assignment Points:</label>

          <input id="export-assignment-points" type="number" placeholder="10" />
        </div>
      </div>

      <div className="export-footer">
        <button className="cancel" onClick={cancel}>
          Cancel
        </button>

        <button className="export" onClick={exportGrades}>
          Export
        </button>
      </div>
    </form>
  );
};

export default ExportModal;
