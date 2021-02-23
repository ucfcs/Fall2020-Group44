import React, { ReactElement } from "react";
import "./poll-controls.scss";

const PollControls = (props: PollControlsProps): ReactElement => {
  const buttons: ReactElement[] = [];

  for (let i = 0; i < props.questionCount; i++) {
    let activeClass;

    if (i === props.questionNumber) {
      activeClass = "question-nav-button active";
    } else {
      activeClass = "question-nav-button";
    }

    buttons.push(
      <span className={activeClass}>
        <img src="/img/logo.svg" alt="" />Q{i + 1}
      </span>
    );
  }

  return (
    <div className="poll-controls">
      <div className="question-nav">{buttons.map((button) => button)}</div>

      <div className="control-buttons">
        <button className="back-button control-button">Back</button>

        <button className="next-button control-button">Next</button>

        <button className="skip-button control-button">Skip Poll</button>
      </div>
    </div>
  );
};

interface PollControlsProps {
  questionNumber: number;
  questionCount: number;
}

export default PollControls;
