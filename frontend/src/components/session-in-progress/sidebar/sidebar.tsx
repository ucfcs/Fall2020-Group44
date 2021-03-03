import React, { ReactElement, SyntheticEvent, useContext } from "react";

import { RESPOND } from "../../../constants";
import { store } from "../../../store";

import "./sidebar.scss";

const Sidebar = (props: SidebarProps): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionNumber = state.questionNumber;

  const buttons: number[] = [];

  for (let i = 0; i < props.questionCount; i++) {
    buttons.push(i + 1);
  }

  const pickQuestion = (event: SyntheticEvent): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    let num: number;

    if (target.tagName === "IMG") {
      num = parseInt((target.parentElement as HTMLInputElement).value);
    } else {
      num = parseInt(target.value);
    }

    if (num !== state.questionNumber) {
      dispatch({ type: "update-question-number", payload: num });
      dispatch({ type: "update-question-progress", payload: RESPOND });
    }
  };

  return (
    <nav className="sidebar">
      <ol>
        {buttons.map((number: number, index: number) => (
          <li key={index}>
            <button
              className={`question-nav-button ${
                index === questionNumber ? "active" : ""
              }`}
              value={number - 1}
              onClick={pickQuestion}
            >
              Question {number}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface SidebarProps {
  questionCount: number;
}

export default Sidebar;
