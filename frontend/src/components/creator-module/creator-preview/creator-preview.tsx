import React, { ReactElement, useContext } from "react";
import { store } from "../../../store";

import "./creator-preview.scss";

//TODO: finish creator Preview

//TODO: add props for question

interface Prop {
  newQuestion: Question;
}

interface Question {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

const CreatorPreview = ({ newQuestion }: Prop): ReactElement => {
  const global = useContext(store) as any;
  const state = global.state;

  const previewQuestion = state.editPreviewQuestion
    ? state.questions[state.previewFolder].questions[state.previewQuestion]
    : newQuestion;

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
