import React, { ReactElement } from "react";
import "./question.scss";

import data from "./mock-data.json";
import SessionControls from "../session-controls/session-controls";

const Question = (props: QuestionProps): ReactElement => {
  const correctClass = props.correctAnswer !== undefined ? "correct" : "";
  const incorrectClass = props.correctAnswer !== undefined ? "incorrect" : "";
  const correctClassBackground =
    props.correctAnswer !== undefined ? "correct-background" : "";
  const incorrectClassBackground =
    props.correctAnswer !== undefined ? "incorrect-background" : "";
  let percentages: number[] = [];

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
            <div key={index} className="answer">
              <div
                className={`always-displayed ${
                  index === props.correctAnswer
                    ? correctClassBackground
                    : incorrectClassBackground
                }`}
              >
                <div className="answer-letter">
                  <p>{String.fromCharCode(65 + index)}</p>
                </div>

                <div className="answer-info">
                  <p className="answer-text">{answer}</p>

                  {props.showPercentages ? (
                    <>
                      <div
                        style={{ width: `${percentages[index]}%` }}
                        className={`correct-bar ${
                          index === props.correctAnswer
                            ? correctClass
                            : incorrectClass
                        }`}
                      />

                      <div className="percentage">
                        <p>{percentages[index]}%</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {props.correctAnswer !== undefined ? (
                // for some reason .svg breaks vscode colors, but it actually works fine
                <img
                  src={`/img/${
                    index === props.correctAnswer ? "check" : "x"
                  }.svg`}
                  alt=""
                />
              ) : null}
            </div>
          );
        })}

        <SessionControls questionCount={props.questionCount} />
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
  questionCount: number;
}

export default Question;
