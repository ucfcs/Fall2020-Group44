import React, { ReactElement } from "react";
import { QuestionOption } from "../../../types";
import "./multiple-choice.scss";

const MultipleChoice = ({
  answers,
  showCorrectPreviewResponse,
}: Props): ReactElement => {
  return (
    <div className="multiple-choice">
      {answers.map((answer, index) => (
        <div
          key={index}
          className={`answer-choice ${
            showCorrectPreviewResponse
              ? answer.isAnswer
                ? "correct"
                : "incorrect"
              : "neutral"
          }`}
        >
          <div className="answer-info">
            <div className="letter">
              <p>{String.fromCharCode(65 + index)}</p>
            </div>

            <div className="answer-body">
              <div
                className="response-bar"
                style={{
                  width: showCorrectPreviewResponse ? "100%" : "",
                }}
              />

              <div className="answer-text">
                <span>{answer.text}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

type Props = {
  answers: QuestionOption[];
  showCorrectPreviewResponse: boolean;
};

export default MultipleChoice;
