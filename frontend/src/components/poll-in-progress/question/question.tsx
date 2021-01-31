import React, { ReactElement } from "react";
import "./question.scss";

const Question = (props: QuestionProps): ReactElement => {
  return (
    <div className="question">
      <h2>{props.questionText}</h2>

      <div className="answers">
        {props.answers.map((answer: string, index: number) => {
          return (
            <p key={index}>
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="answer-text">{answer}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

interface QuestionProps {
  questionText: string;
  answers: string[];
}

export default Question;
