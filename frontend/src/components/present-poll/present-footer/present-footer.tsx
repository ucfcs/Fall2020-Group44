import React, {
  FocusEvent,
  MouseEvent,
  ReactElement,
  useState,
  useContext,
} from "react";
import { store } from "../../../store";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import "./present-footer.scss";

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const PresentFooter = (): ReactElement => {
  const global = useContext(store) as any;
  const state = global.state;

  const forceUpdate = useForceUpdate();

  const [questions, setQuestions] = useState<PollQuestion[]>(state.poll);
  const [questionsShown, setQuestionsShown] = useState(
    new Array(state.poll.length).fill(false)
  );

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      const newQuestions: PollQuestion[] = questions;
      const [srcQuestion] = questions.splice(result.source.index, 1);
      newQuestions.splice(result.destination.index, 0, srcQuestion);
      setQuestions(state.poll);
    }
  };

  const handleShowTooltip = (
    e: FocusEvent<HTMLLIElement> | MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newShowArray = questionsShown;
    newShowArray[index] = true;
    setQuestionsShown(newShowArray);
    forceUpdate();
  };

  const handleHideTooltip = (
    e: FocusEvent<HTMLLIElement> | MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newShowArray = questionsShown;
    newShowArray[index] = false;
    setQuestionsShown(newShowArray);
    forceUpdate();
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    state.poll = newQuestions;
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
                        questionsShown[index] ? "show" : ""
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
