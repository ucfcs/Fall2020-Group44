import React, { ReactElement, SyntheticEvent, useContext } from "react";
import { Question } from "../../../types";
import { store } from "../../../store";

import "./sidebar.scss";

const Sidebar = (props: SidebarProps): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionNumber = state.questionNumber;

  const buttons: number[] = [];

  for (let i = 0; i < props.questions.length; i++) {
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
              Question {number} {props.questions[index].isClosed ? "✓" : ""}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface SidebarProps {
  questions: Question[];
}

export default Sidebar;
