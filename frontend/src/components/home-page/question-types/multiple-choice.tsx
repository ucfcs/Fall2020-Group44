import React, { ReactElement } from "react";
import "./multiple-choice.scss";

type Props = {
  answers: string[];
  correct: number;
  responses: string[];
  showPreviewResponse: boolean;
  showCorrectPreviewResponse: boolean;
};

type AnswerChoiceProps = {
  answer: string;
  letter: string;
  correct: boolean;
  response: string;
  showPreviewResponse: boolean;
  showCorrectPreviewResponse: boolean;
};

const AnswerChoice = ({
  answer,
  letter,
  correct,
  response,
  showPreviewResponse,
  showCorrectPreviewResponse,
}: AnswerChoiceProps) => {
  return (
    <div
      className={`answer-choice ${
        showCorrectPreviewResponse ? (correct ? "correct" : "incorrect") : ""
      }`}
    >
      <div
        className="response-bar"
        style={{
          width: showPreviewResponse
            ? response
            : showCorrectPreviewResponse
            ? "100%"
            : "",
        }}
      ></div>
      <div className="answer-info">
        <div className="letter">
          <p>{letter}</p>
        </div>
        <div className="answer-text">
          <span>{answer}</span>
        </div>
        <div className="responses">{showPreviewResponse ? response : ""}</div>
      </div>
    </div>
  );
};

const MultipleChoice = ({
  answers,
  correct,
  responses,
  showPreviewResponse,
  showCorrectPreviewResponse,
}: Props): ReactElement => {
  return (
    <div className="multiple-choice">
      {answers.map((answer, index) => (
        <AnswerChoice
          key={index}
          answer={answer}
          correct={correct === index}
          response={responses[index]}
          letter={String.fromCharCode(65 + index)}
          showPreviewResponse={showPreviewResponse}
          showCorrectPreviewResponse={showCorrectPreviewResponse}
        />
      ))}
    </div>
  );
};

export default MultipleChoice;
