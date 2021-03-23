import React, { ReactElement, useContext } from "react";
import { store } from "../../../store";
import { Question } from "../../../types";

import "./creator-preview.scss";

//TODO: finish creator Preview

//TODO: add props for question

const CreatorPreview = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const question: Question = state.currentQuestionInfo;

  const previewQuestion = state.editPreviewQuestion
    ? state.questions[state.previewFolder].questions[state.previewQuestion]
    : question;

  return (
    <div className="creator-preview">
      <div className="preview-title">{previewQuestion.title}</div>
      <div className="preview-question">{previewQuestion.question}</div>
      {previewQuestion.choices.map((answer: string, index: number) => (
        <div key={index} className="answer">
          <div className="answer-letter">{String.fromCharCode(65 + index)}</div>

          <div className="answer-text">{answer}</div>
        </div>
      ))}
    </div>
  );
};

export default CreatorPreview;
