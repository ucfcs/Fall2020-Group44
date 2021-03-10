import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import { store } from "../../../store";
import "./present-preview.scss";

const PresentPreview = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  return (
    <div className="present-preview">
      <div className="preview-left">
        <img
          alt="UCF React Logo"
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
