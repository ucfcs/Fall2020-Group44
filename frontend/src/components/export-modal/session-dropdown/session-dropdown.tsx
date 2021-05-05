import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import { store } from "../../../store";
import { QuestionGradeInfo, SessionGradesResponse } from "../../../types";
import { catchError, getSessionGrades } from "../../../util/api";

import "./session-dropdown.scss";

const SessionDropdown = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const [isOpen, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(props.preSelected);

  const [questions, setQuestions] = useState<string[]>([]);

  const iconClass = isOpen ? "open" : "closed";

  const handleDropdown = (event: SyntheticEvent): void => {
    event.preventDefault();

    // load the questions if the dropdown is open and they aren't already loaded
    if (!isOpen && questions.length <= 0) {
      getSessionGrades(state.courseId, props.id, state.jwt)
        .then((response: Response) => response.json())
        .then((response: SessionGradesResponse) => {
          const questionTitles: string[] = [];

          response.session.Questions.forEach((question: QuestionGradeInfo) => {
            questionTitles.push(question.title);
          });

          setQuestions(questionTitles);
        })
        .catch(catchError);
    }

    setOpen(!isOpen);
  };

  const handleSelect = (event: SyntheticEvent): void => {
    const checked: boolean = (event.target as HTMLInputElement).checked;

    setIsSelected(checked);

    if (checked) {
      const newSelectedIds: number[] = [...props.selectedIds];
      newSelectedIds.push(props.id);

      props.setSelectedIds(newSelectedIds);
    } else {
      const newSelectedIds: number[] = props.selectedIds.filter(
        (id: number) => id !== props.id
      );

      props.setSelectedIds(newSelectedIds);
    }
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
              {questions.map(
                (question: string, index: number): ReactElement => (
                  <li key={index}>{question}</li>
                )
              )}
            </ol>
          ) : null}
        </div>
      </div>

      <span className="points" onClick={handleDropdown}>
        {props.points}
      </span>
    </div>
  );
};

interface Props {
  name: string;
  points: number;
  index: number;
  preSelected: boolean;
  id: number;
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
  selectedIds: number[];
}

export default SessionDropdown;
