import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import "./present-preview.scss";

const PresentPreview = (): ReactElement => {
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
        {/* TODO: implement number connected */}
        <p className="num-connected">{87}</p>
        <p className="connected-label">Students Connected</p>
      </div>
    </div>
  );
};

export default PresentPreview;
