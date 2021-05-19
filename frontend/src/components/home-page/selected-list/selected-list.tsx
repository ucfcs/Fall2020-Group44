import React, { useContext, ReactElement } from "react";
import { Link } from "react-router-dom";

import { store } from "../../../store";

import "./selected-list.scss";

const SelectedList = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  return (
    <div className="selected-list">
      <div className="selected-list__questions">
        {state.sessionQuestions.map((question: PollQuestion, index: number) => (
          <p key={index} className="selected-list__question">
            {index + 1 + ". " + question.title + " - " + question.question}
          </p>
        ))}
      </div>

      <div className="option-buttons">
        <button className="present-button">
          <Link to="/session/present">&#9658;&nbsp;Present</Link>
        </button>
      </div>
    </div>
  );
};

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

export default SelectedList;
