import React, { ReactElement, SyntheticEvent } from "react";
import { Question, QuestionOption } from "../../../types";

const AnswerChoice = ({
  answer,
  letter,
  index,
  question,
  setQuestionInfo,
}: SingleAnswerChoiceProps): ReactElement => {
  const handleAnswerChange = (e: SyntheticEvent, index: number) => {
    const tempQuestion = question;
    tempQuestion.questionOptions[index][
      "text"
    ] = (e.target as HTMLInputElement).value;
    setQuestionInfo(tempQuestion);
  };

  const handleCorrectChange = (index: number) => {
    const tempQuestion = { ...question, correct: index };
    setQuestionInfo(tempQuestion);
  };

  const handleAnswerDelete = (index: number) => {
    const tempQuestion = question;
    tempQuestion.questionOptions.splice(index, 1);
    setQuestionInfo(tempQuestion);
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
          defaultChecked={answer.isAnswer}
          onChange={() => handleCorrectChange(index)}
        />

        <label htmlFor={"correct-answer-" + index}>Correct Answer</label>
      </div>

      <div className="delete-answer">
        <div onClick={() => handleAnswerDelete(index)}>X</div>
      </div>
    </div>
  );
};

type SingleAnswerChoiceProps = {
  answer: QuestionOption;
  letter: string;
  index: number;
  question: Question;
  setQuestionInfo: (arg0: Question) => void;
};

export default AnswerChoice;
