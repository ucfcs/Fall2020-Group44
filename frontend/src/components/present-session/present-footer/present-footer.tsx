import React, {
  FocusEvent,
  MouseEvent,
  ReactElement,
  useState,
  useContext,
} from "react";
import { store } from "../../../store";
import "./present-footer.scss";

// https://github.com/atlassian/react-beautiful-dnd
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

function useForceUpdate() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const PresentFooter = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const forceUpdate = useForceUpdate();

  const [questions, setQuestions] = useState<PollQuestion[]>(
    state.sessionQuestions
  );

  // array of booleans indicating which tooltip(s) is/are shown
  const [showTooltip, setShowTooltip] = useState(
    new Array(state.sessionQuestions.length).fill(false)
  );

  // reorganize session questions on drag end
  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      const newQuestions: PollQuestion[] = questions;
      const [srcQuestion] = questions.splice(result.source.index, 1);
      newQuestions.splice(result.destination.index, 0, srcQuestion);
      dispatch({ type: "update-session-questions", payload: newQuestions });
      setQuestions(newQuestions);
    }
  };

  const handleShowTooltip = (
    e: FocusEvent<HTMLLIElement> | MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newShowArray = showTooltip;
    newShowArray[index] = true;
    setShowTooltip(newShowArray);
    forceUpdate();
  };

  const handleHideTooltip = (
    e: FocusEvent<HTMLLIElement> | MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newShowArray = showTooltip;
    newShowArray[index] = false;
    setShowTooltip(newShowArray);
    forceUpdate();
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    dispatch({ type: "update-session-questions", payload: newQuestions });
    setQuestions(newQuestions);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="present-footer" direction="horizontal">
        {(provided) => (
          <ul
            className="present-footer"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {questions.map((question, index) => (
              <Draggable key={index} draggableId={index + ""} index={index}>
                {(provided) => (
                  <li
                    className="footer-question"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onFocus={(e) => handleShowTooltip(e, index)}
                    onMouseEnter={(e) => handleShowTooltip(e, index)}
                    onBlur={(e) => handleHideTooltip(e, index)}
                    onMouseLeave={(e) => handleHideTooltip(e, index)}
                  >
                    <div
                      className={`footer-tooltip ${
                        showTooltip[index] ? "show" : ""
                      }`}
                    >
                      {question.title}
                    </div>
                    <img src="/img/logo.svg" />
                    <p>
                      {"Q" + (index + 1)} {question.title}
                    </p>
                    <button
                      className="delete"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      X
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PresentFooter;
