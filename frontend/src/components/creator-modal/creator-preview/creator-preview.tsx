import React, { ReactElement, useContext } from "react";

import { store } from "../../../store";
import { Question, QuestionOption } from "../../../types";

import "./creator-preview.scss";

const CreatorPreview = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const question: Question = JSON.parse(
    JSON.stringify(state.currentQuestionInfo)
  );

  const previewQuestion: Question = state.editPreviewQuestion
    ? state.questions[state.previewFolder].Questions[state.previewQuestion]
    : question;

  return (
    <div className="creator-preview">
      <div className="preview-title">{previewQuestion.title}</div>

      <div className="preview-question">{previewQuestion.question}</div>

      {previewQuestion.QuestionOptions.map(
        (answer: QuestionOption, index: number) => (
          <div key={index} className="answer">
            <div className="answer-letter">
              {String.fromCharCode(65 + index)}
            </div>

            <div className="answer-text">{answer.text}</div>
          </div>
        )
      )}
    </div>
  );
};

export default CreatorPreview;
