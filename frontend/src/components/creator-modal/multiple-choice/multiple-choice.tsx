import React, { useState, useEffect, ReactElement } from "react";
import { Question, QuestionOption } from "../../../types";
import AnswerChoice from "../answer-choice/answer-choice";
import "./multiple-choice.scss";

const MultipleChoice = ({
  answers,
  question,
  setQuestionInfo,
}: Props): ReactElement => {
  const [answerChoices, setAnswerChoices] = useState([
    { text: "", isAnswer: false },
    { text: "", isAnswer: false },
  ]);

  useEffect(() => {
    if (answers.length > 0) {
      setAnswerChoices(answers);
    }
  }, [answers]);

  const onAddAnswer = () => {
    setAnswerChoices((oldAnswerChoices) => [
      ...oldAnswerChoices,
      { text: "", isAnswer: false },
    ]);
  };

  return (
    <div className="answer-choices">
      <span className="answer-choice-header">
        <span className="red">*</span> Answers:
      </span>

      {answerChoices.map((answer, index) => (
        <AnswerChoice
          key={index}
          index={index}
          answer={answer}
          letter={String.fromCharCode(65 + index)}
          question={question}
          setQuestionInfo={setQuestionInfo}
        />
      ))}

      <div className="add-answer">
        <div className="add-answer-button" onClick={onAddAnswer}>
          <span className="add-answer-icon">&#8853;&nbsp;</span>

          <span className="add-answer-text">Add Answer Choice</span>
        </div>
      </div>
    </div>
  );
};

type Props = {
  answers: QuestionOption[];
  question: Question;
  setQuestionInfo: (arg0: Question) => void;
};

export default MultipleChoice;
