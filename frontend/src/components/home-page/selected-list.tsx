import React, { useState, useContext, ReactElement } from "react";
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
    <div className="selected-list__wrapper">
      <div className="selected-list__questions">
        {state.poll.map((question: PollQuestion, index: number) => (
          <div key={index} className="selected-list__question">
            {index + 1 + ". " + question.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedList;
