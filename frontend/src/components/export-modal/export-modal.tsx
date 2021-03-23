import React, { ReactElement, useContext } from "react";
import { useLocation } from "react-router-dom";
import { store } from "../../store";

import data from "./mock-data.json";

import "./export-modal.scss";
import SessionDropdown from "./session-dropdown/session-dropdown";
import Modal from "../modal/modal";

const ExportModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const location = useLocation();
  const path: string = location.pathname;
  let id: number;

  // if the path is /gradebook/:id get the id
  if (path.match(/\/gradebook\/\d+/)) {
    const splitUp: string[] = path.split("/");
    id = parseInt(splitUp[2]);
  }

  const sessions = data.overallSessions;

  const cancel = (): void => {
    dispatch({ type: "close-export-modal" });
  };

  const exportGrades = (): void => {
    dispatch({ type: "close-export-modal" });
  };

  return (
    <Modal>
      <form className="export-modal">
        <div className="export-header">
          <h3>Export to Webcourses</h3>

          <button className="exit-button" onClick={cancel}>
            X
          </button>
        </div>

        <div className="session-list">
          <div className="labels">
            <span>Session</span>

            <span className="points">Points</span>

            <span className="date">Date</span>
          </div>

          {sessions.map(
            (session, index: number): ReactElement => {
              if (id !== undefined && id === session.id) {
                return (
                  <SessionDropdown
                    key={index}
                    name={session.name}
                    date={session.date}
                    questions={session.questions}
                    points={session.total}
                    index={index}
                    preSelected={true}
                  />
                );
              }

              return (
                <SessionDropdown
                  key={index}
                  name={session.name}
                  date={session.date}
                  questions={session.questions}
                  points={session.total}
                  index={index}
                  preSelected={false}
                />
              );
            }
          )}
        </div>

        <div className="metadata">
          <div className="assignment-input">
            <label htmlFor="export-assignment-name">Assignment Name:</label>

            <input id="export-assignment-name" placeholder="Assignment 1" />
          </div>

          <div>
            <label htmlFor="export-assignment-points">Assignment Points:</label>

            <input
              id="export-assignment-points"
              type="number"
              placeholder="10"
            />
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
    </Modal>
  );
};

export default ExportModal;
