import React, { ReactElement } from "react";
import "./question.scss";

import data from "./mock-data.json";
import SessionControls from "../session-controls/session-controls";
import { QuestionOption } from "../../../types";
import { CORRECT_RESPONSE } from "../../../constants";

const QuestionComponent = (props: QuestionProps): ReactElement => {
  const correctAnswers: number[] = [];
  if (props.questionProgress == CORRECT_RESPONSE) {
    props.answers.forEach((answer) => {
      if (answer.isAnswer) {
        correctAnswers.push(answer.id);
      }
    });
  }
  const correctClass =
    props.questionProgress == CORRECT_RESPONSE ? "correct" : "";
  const incorrectClass =
    props.questionProgress == CORRECT_RESPONSE ? "incorrect" : "";
  const correctClassBackground =
    props.questionProgress == CORRECT_RESPONSE ? "correct-background" : "";
  const incorrectClassBackground =
    props.questionProgress == CORRECT_RESPONSE ? "incorrect-background" : "";
  let percentages: number[] = [];

  if (props.showPercentages) {
    // This will become api call
    percentages = data.percentages;
  }

  return (
    <div className="question">
      <h2>{props.questionText}</h2>

      <div className="answers">
        {props.answers.map((answer: QuestionOption, index: number) => {
          return (
            <div key={index} className="answer">
              <div
                className={`always-displayed ${
                  answer.isAnswer
                    ? correctClassBackground
                    : incorrectClassBackground
                }`}
              >
                <div className="answer-letter">
                  <p>{String.fromCharCode(65 + index)}</p>
                </div>

                <div className="answer-info">
                  <p className="answer-text">{answer.text}</p>

                  {props.showPercentages ? (
                    <>
                      <div
                        style={{ width: `${percentages[index]}%` }}
                        className={`correct-bar ${
                          answer.isAnswer ? correctClass : incorrectClass
                        }`}
                      />

                      <div className="percentage">
                        <p>{percentages[index]}%</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {props.questionProgress == CORRECT_RESPONSE ? (
                // for some reason .svg breaks vscode colors, but it actually works fine
                <img
                  src={`/img/${answer.isAnswer ? "check" : "x"}.svg`}
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
  answers: QuestionOption[];
  closed?: boolean;
  showPercentages: boolean;
  questionCount: number;
  questionProgress: number;
}

export default QuestionComponent;
