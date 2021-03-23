import React, { ReactElement, SyntheticEvent, useContext } from "react";
import { store } from "../../../store";
import { Question, QuestionOption } from "../../../types";

import "./answer-choice.scss";

const AnswerChoice = ({
  answer,
  letter,
  index,
}: SingleAnswerChoiceProps): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const question: Question = state.currentQuestionInfo;

  const handleAnswerChange = (e: SyntheticEvent, index: number) => {
    const tempQuestion = question;

    tempQuestion.questionOptions[index][
      "text"
    ] = (e.target as HTMLInputElement).value;

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const handleCorrectChange = (event: SyntheticEvent, index: number) => {
    const tempQuestion = { ...question, correct: index };

    tempQuestion.questionOptions[index][
      "isAnswer"
    ] = (event.target as HTMLInputElement).checked;

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const handleAnswerDelete = (index: number) => {
    const tempQuestion = question;
    tempQuestion.questionOptions.splice(index, 1);

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  return (
    <div className="answer-choice">
      <div className="letter">
        <p>{letter}</p>
      </div>

      <div className="answer-text">
        <input
          type="text"
          required
          placeholder="Response..."
          defaultValue={answer.text}
          onChange={(e) => handleAnswerChange(e, index)}
        />
      </div>

      <div className="correct-checkbox">
        <input
          type="checkbox"
          id={"correct-answer-" + index}
          checked={answer.isAnswer}
          onChange={(event: SyntheticEvent) =>
            handleCorrectChange(event, index)
          }
        />

        <label htmlFor={"correct-answer-" + index}>Correct Answer</label>
      </div>

      <button
        className="delete-answer"
        onClick={() => handleAnswerDelete(index)}
      >
        X
      </button>

      {/* <div className="delete-answer">
        <div onClick={() => handleAnswerDelete(index)}>X</div>
      </div> */}
    </div>
  );
};

type SingleAnswerChoiceProps = {
  answer: QuestionOption;
  letter: string;
  index: number;
};

export default AnswerChoice;
