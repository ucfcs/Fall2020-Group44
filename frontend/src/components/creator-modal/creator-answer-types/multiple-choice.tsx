import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ReactElement,
} from "react";
import { Question } from "../../../types";
import "./multiple-choice.scss";

const AnswerChoice = ({
  answer,
  letter,
  index,
  correct,
  question,
  setQuestionInfo,
}: SingleAnswerChoiceProps) => {
  const handleAnswerChange = (e: SyntheticEvent, index: number) => {
    const tempQuestion = question;
    tempQuestion.choices[index] = (e.target as HTMLInputElement).value;
    setQuestionInfo(tempQuestion);
  };

  const handleCorrectChange = (index: number) => {
    const tempQuestion = { ...question, correct: index };
    setQuestionInfo(tempQuestion);
  };

  const handleAnswerDelete = (index: number) => {
    const tempQuestion = question;
    tempQuestion.choices = question.choices.filter((_, i) => i === index);
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
          defaultValue={answer}
          onChange={(e) => handleAnswerChange(e, index)}
        />
      </div>
      <div className="correct-checkbox">
        <input
          type="checkbox"
          id={"correct-answer-" + index}
          defaultChecked={correct}
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

const MultipleChoice = ({
  answers,
  correct,
  question,
  setQuestionInfo,
}: Props): ReactElement => {
  const [answerChoices, setAnswerChoices] = useState(["", ""]);

  useEffect(() => {
    if (answers.length > 0) {
      setAnswerChoices(answers);
    }
  }, [answers]);

  const onAddAnswer = () => {
    setAnswerChoices((oldAnswerChoices) => [...oldAnswerChoices, ""]);
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
          correct={correct === index}
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
  answers: string[];
  correct: number;
  question: Question;
  setQuestionInfo: (arg0: Question) => void;
};

type SingleAnswerChoiceProps = {
  answer: string;
  letter: string;
  index: number;
  correct: boolean;
  question: Question;
  setQuestionInfo: (arg0: Question) => void;
};

export default MultipleChoice;
