import React, { ReactElement } from "react";
import "./multiple-choice.scss";

type Props = {
  answers: string[];
  correct: number;
  responses: string[];
  showPreviewResponse: boolean;
  showCorrectPreviewResponse: boolean;
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
        <div
          key={index}
          className={`answer-choice ${
            showCorrectPreviewResponse
              ? correct === index
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
                  width: showPreviewResponse
                    ? responses[index]
                    : showCorrectPreviewResponse
                    ? "100%"
                    : "",
                }}
              ></div>
              <div className="answer-text">
                <span>{answer}</span>
              </div>
              <div className="responses">
                {showPreviewResponse ? responses[index] : ""}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;
