import React, { useState, useContext, ReactElement } from "react";
import { Link } from "react-router-dom";
import "./selected-list.scss";
import { store } from "../../store";

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

const SelectedList = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  return (
    <div className="selected-list">
      <div className="selected-list__questions">
        {state.poll.map((question: PollQuestion, index: number) => (
          <p key={index} className="selected-list__question">
            {index + 1 + ". " + question.title + " - " + question.question}
          </p>
        ))}
      </div>
      <div className="option-buttons">
        <button className="present-button">
          <Link to="/poll/present">&#9658;&nbsp;Present</Link>
        </button>
      </div>
    </div>
  );
};

export default SelectedList;
