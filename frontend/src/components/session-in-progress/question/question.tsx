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

                  <div className="answer-info">
                    <p className="answer-text">{answer}</p>

                    {props.showPercentages ? (
                      <>
                        <div
                          style={{ width: `${percentages[index]}%` }}
                          className="correct-bar"
                        />

                        <p>{percentages[index]}%</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
