import React, { ReactElement } from "react";
import "./question.scss";

import data from "./mock-data.json";

const Question = (props: QuestionProps): ReactElement => {
  const correctClass = props.correctAnswer !== undefined ? "correct" : "";
  const incorrectClass = props.correctAnswer !== undefined ? "incorrect" : "";
  let percentages: number[] = [];

  if (props.showPercentages) {
    // This will become api call
    console.log("Show percentages");
    percentages = data.percentages;
  }

  return (
    <div className="question">
      {props.closed ? <p className="closed-warning">Closed</p> : null}

      <h2>{props.questionText}</h2>

      <div className="main-info">
        <div className="answers">
          {props.answers.map((answer: string, index: number) => {
            return (
              <div
                key={index}
                className={`answer ${
                  index === props.correctAnswer ? correctClass : incorrectClass
                }`}
              >
                <div className="always-displayed">
                  <p className="answer-letter">
                    {String.fromCharCode(65 + index)}
                  </p>

                  <p className="answer-text">{answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {props.showPercentages ? (
          <div className="percentages">
            {percentages.map(
              (percentage: number, index: number): ReactElement => {
                return (
                  <div className="percent-info" key={index}>
                    <label htmlFor={`prog-${index}`}>{percentage}%</label>

                    <progress max="100" value={percentage} id={`prog-${index}`}>
                      {percentage}%
                    </progress>
                  </div>
                );
              }
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface QuestionProps {
  questionText: string;
  answers: string[];
  closed?: boolean;
  showPercentages: boolean;
  correctAnswer?: number | number[];
}

export default Question;
