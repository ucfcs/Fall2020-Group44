import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import "./present-preview.scss";

const PresentPreview = (props: Props): ReactElement => {
  return (
    <div className="present-preview">
      <div className="preview-left">
        <img
          alt="Responses Logo"
          className="present-preview-logo"
          src="/img/logo.svg"
        />
        <h2>{"Let's Begin!"}</h2>
        <button className="start-button">
          <Link to="/poll/display">Start Session &gt;</Link>
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
