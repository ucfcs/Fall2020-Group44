import React, {
  useState,
  useEffect,
  SyntheticEvent,
  ReactElement,
} from "react";
import "./multiple-choice.scss";

type Props = {
  answers: string[];
  correct: number;
  newQuestion: Question;
  setNewQuestion: (arg0: Question) => void;
};

interface Question {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

type SingleAnswerChoiceProps = {
  answer: string;
  letter: string;
  index: number;
  correct: boolean;
  newQuestion: Question;
  setNewQuestion: (arg0: Question) => void;
};

const AnswerChoice = ({
  answer,
  letter,
  index,
  correct,
  newQuestion,
  setNewQuestion,
}: SingleAnswerChoiceProps) => {
  const handleAnswerChange = (e: SyntheticEvent, index: number) => {
    const tempQuestion = newQuestion;
    tempQuestion.choices[index] = (e.target as HTMLInputElement).value;
    setNewQuestion(tempQuestion);
  };

  const handleCorrectChange = (index: number) => {
    const tempQuestion = { ...newQuestion, correct: index };
    setNewQuestion(tempQuestion);
  };

  const handleAnswerDelete = (index: number) => {
    const tempQuestion = newQuestion;
    tempQuestion.choices = newQuestion.choices.filter((_, i) => i === index);
    setNewQuestion(tempQuestion);
  };

  return (
    <div className="answer-choice">
      <div className="letter">
        <p>{letter}</p>
      </div>
      <div className="answer-text">
        <input
          type="text"
          placeholder="Response..."
          defaultValue={answer}
          onChange={(e) => handleAnswerChange(e, index)}
        />
      </div>
      <div className="correct-checkbox">
        <input
          type="checkbox"
          id="correct-answer"
          defaultChecked={correct}
          onChange={() => handleCorrectChange(index)}
        />
        <label>Correct Answer</label>
      </div>
      <div className="delete-answer">
        <button onClick={() => handleAnswerDelete(index)}>X</button>
      </div>
    </div>
  );
};

const MultipleChoice = ({
  answers,
  correct,
  newQuestion,
  setNewQuestion,
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
      <span className="answer-choice-header">Answers:</span>
      {answerChoices.map((answer, index) => (
        <AnswerChoice
          key={index}
          index={index}
          answer={answer}
          letter={String.fromCharCode(65 + index)}
          correct={correct === index}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
        />
      ))}
      <div className="add-answer">
        <button className="add-answer-button" onClick={onAddAnswer}>
          <span className="add-answer-icon">&#8853;</span>
          <span>Add Answer Choice</span>
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;
