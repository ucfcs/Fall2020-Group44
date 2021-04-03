import React, { ReactElement } from "react";
import "./question.scss";

import SessionControls from "../session-controls/session-controls";
import { QuestionOption } from "../../../types";
import { CORRECT_RESPONSE } from "../../../constants";

const QuestionComponent = (props: QuestionProps): ReactElement => {
  // determine which of the answer choices are correct options
  const correctAnswers: number[] = [];
  if (props.questionProgress == CORRECT_RESPONSE) {
    props.answers.forEach((answer) => {
      if (answer.isAnswer && answer.id) {
        correctAnswers.push(answer.id);
      }
    });
  }

  // css classes to be added to the question options
  const correctClass =
    props.questionProgress == CORRECT_RESPONSE ? "correct" : "";
  const incorrectClass =
    props.questionProgress == CORRECT_RESPONSE ? "incorrect" : "";
  const correctClassBackground =
    props.questionProgress == CORRECT_RESPONSE ? "correct-background" : "";
  const incorrectClassBackground =
    props.questionProgress == CORRECT_RESPONSE ? "incorrect-background" : "";

  return (
    <div className="question">
      <h2>{props.questionText}</h2>

      <div className="answers">
        {props.answers.map((answer: QuestionOption, index: number) => {
          // calculate percentage for each answer choice
          // if not calculable then set to 0
          let responseCount = answer.responseCount || 0;
          if (responseCount < 0) responseCount = 0;
          const responseTotal =
            props.responseTotal > 0 ? props.responseTotal : 1;
          let percentage = Math.round((responseCount / responseTotal) * 100);
          if (percentage > 100) percentage = 100;
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
                        style={{ width: `${percentage}%` }}
                        className={`correct-bar ${
                          answer.isAnswer ? correctClass : incorrectClass
                        }`}
                      />

                      <div className="percentage">
                        <p>{percentage}%</p>
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
  responseTotal: number;
}

export default QuestionComponent;
