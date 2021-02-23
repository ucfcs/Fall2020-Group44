import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import "./present-preview.scss";

const PresentPreview = (): ReactElement => {
  return (
    <div className="present-preview">
      <img className="present-preview-logo" src="/img/logo.svg" />
      <h2>
        {
          "Who was the first president of the United States and also what would you do if you met him and also this is really long?"
        }
      </h2>
      <button className="start-button">
        <Link to="/poll/display">Start Poll &gt;</Link>
      </button>
      <button className="skip-button">{"Skip to Next Poll >>"}</button>
      <p className="helper-text">
        Click Start Poll to begin collecting responses
      </p>
    </div>
  );
};

export default PresentPreview;
