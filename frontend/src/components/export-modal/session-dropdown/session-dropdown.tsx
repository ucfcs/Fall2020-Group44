import React, { ReactElement, SyntheticEvent, useState } from "react";
import { Question } from "../../../types";

import "./session-dropdown.scss";

const SessionDropdown = (props: Props): ReactElement => {
  const [isOpen, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(props.preSelected);

  const iconClass = isOpen ? "open" : "closed";

  const handleDropdown = (event: SyntheticEvent): void => {
    event.preventDefault();
    setOpen(!isOpen);
  };

  const handleSelect = (event: SyntheticEvent): void => {
    setIsSelected((event.target as HTMLInputElement).checked);
  };

  return (
    <div className="session-dropdown">
      <div className="left-side">
        <input
          id={`question-${props.index}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
        />

        <div>
          <button className="dropdown" onClick={handleDropdown}>
            {/* Putting .svg at the end of the string breaks vscode syntax highlighting
              but it actually works fine. */}
            <img
              src={`/img/dropdown-${iconClass}.svg`}
              alt="Dropdown"
              className={iconClass}
            />
          </button>

          <label onClick={handleDropdown} htmlFor={`question-${props.index}`}>
            {props.name}
          </label>

          {isOpen ? (
            <ol>
              {props.questions.map(
                (question: Question, index: number): ReactElement => (
                  <li key={index}>{question.title}</li>
                )
              )}
            </ol>
          ) : null}
        </div>
      </div>

      <span className="points" onClick={handleDropdown}>
        {props.points}
      </span>

      <span className="date" onClick={handleDropdown}>
        {props.date}
      </span>
    </div>
  );
};

interface Props {
  name: string;
  date: string;
  questions: Question[];
  points: number;
  index: number;
  preSelected: boolean;
}

export default SessionDropdown;
