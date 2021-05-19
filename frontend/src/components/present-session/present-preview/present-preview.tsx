import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";

import { store } from "../../../store";

import "./present-preview.scss";

const PresentPreview = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const setClassSize = () => {
    dispatch({ type: "update-class-size", payload: props.studentsConnected });
  };

  const startSession = () => {
    dispatch({ type: "enable-exit-warning" });
  };

  return (
    <div className="present-preview">
      <div className="preview-left">
        <img
          alt="Responses Logo"
          className="present-preview-logo"
          src="/img/logo.svg"
        />

        <h2>{"Let's Begin!"}</h2>

        <button onClick={setClassSize} className="start-button">
          <Link to="/session/display" onClick={startSession}>
            Start Session &gt;
          </Link>
        </button>

        <p className="helper-text">
          Click Start Session to begin collecting responses
        </p>
      </div>

      <div className="preview-right">
        <p className="num-connected">{props.studentsConnected}</p>

        <p className="connected-label">Students Connected</p>
      </div>
    </div>
  );
};

interface Props {
  studentsConnected: number;
}

export default PresentPreview;
