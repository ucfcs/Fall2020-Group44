import React, { useState, useContext, ReactElement } from "react";

import { store } from "../../../store";
import { Question } from "../../../types";

import MultipleChoice from "../multiple-choice/multiple-choice";

import "./question-preview.scss";

const QuestionPreview = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const [showCorrectPreviewResponse, setShowCorrectPreviewResponse] = useState(
    false
  );

  const toggleShowCorrectResponse = () => {
    setShowCorrectPreviewResponse(!showCorrectPreviewResponse);
  };

  const previewQuestion: Question =
    state.questions[state.previewFolder]?.Questions[state.previewQuestion];

  const previewFolder = state.questions[state.previewFolder]?.name;

  return previewQuestion ? (
    <div className="question-preview">
      <div className="question-preview__info">
        <div className="question-preview__folder">
          <img className="folder-icon" src="/img/folder-icon.svg" alt="" />

          <p>{previewFolder}</p>
        </div>
        <div className="question-preview__title">{previewQuestion.title}</div>

        <div className="question-preview__question">
          {previewQuestion.question}
        </div>

        <div className="response-buttons">
          <button
            className="show-correct-response"
            onClick={toggleShowCorrectResponse}
          >
            {showCorrectPreviewResponse ? "Hide" : "Show"} Correct Answers{" "}
          </button>
        </div>

        <div className="answer-choice-wrapper">
          <MultipleChoice
            answers={previewQuestion.QuestionOptions}
            showCorrectPreviewResponse={showCorrectPreviewResponse}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default QuestionPreview;
