import React, { ReactElement } from "react";
import "./question.scss";

import data from "./mock-data.json";

const Question = (props: QuestionProps): ReactElement => {
  const correctClass = props.correctAnswer !== undefined ? "correct" : "";
  const incorrectClass = props.correctAnswer !== undefined ? "incorrect" : "";
  let percentages: number[];

  if (props.showPercentages) {
    // This will become api call
    console.log("Show percentages");
    percentages = data.percentages;
  }

  return (
    <div className="question">
      <h2>{props.questionText}</h2>

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

              {percentages !== undefined ? (
                <div className="percent-info">
                  <progress max="100" value={percentages[index]}>
                    {percentages[index]}%
                  </progress>

                  <p>{percentages[index]}%</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface QuestionProps {
  questionText: string;
  answers: string[];
  showPercentages: boolean;
  correctAnswer?: number | number[];
}

export default Question;
