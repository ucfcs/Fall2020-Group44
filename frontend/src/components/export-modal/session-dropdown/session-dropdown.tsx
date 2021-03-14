import React, { ReactElement, SyntheticEvent, useState } from "react";

import "./session-dropdown.scss";

const SessionDropdown = (props: Props): ReactElement => {
  const [isOpen, setOpen] = useState(false);

  const iconClass = isOpen ? "open" : "closed";

  const handleDropdown = (event: SyntheticEvent): void => {
    event.preventDefault();
    setOpen(!isOpen);
  };

  return (
    <div className="session-dropdown">
      <div className="left-side">
        <input id={`question-${props.index}`} type="checkbox" />

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
              {props.questionTitles.map(
                (title: string, index: number): ReactElement => (
                  <li key={index}>{title}</li>
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
  questionTitles: string[];
  points: number;
  index: number;
}

export default SessionDropdown;
