import React, { useState, useContext, ReactElement } from "react";
import "./question-preview.scss";
import { store } from "../../store";
import MultipleChoice from "./question-types/multiple-choice";

const QuestionPreview = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [showPreviewResponse, setShowPreviewResponse] = useState(false);
  const [showCorrectPreviewResponse, setShowCorrectPreviewResponse] = useState(
    false
  );

  const toggleShowResponse = () => {
    setShowPreviewResponse(!showPreviewResponse);
  };

  const toggleShowCorrectResponse = () => {
    setShowCorrectPreviewResponse(!showCorrectPreviewResponse);
  };

  const previewQuestion =
    state.questions[state.previewFolder].questions[state.previewQuestion];

  return previewQuestion ? (
    <div className="question-preview">
      <div className="question-preview__info">
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
          <button className="see-responses" onClick={toggleShowResponse}>
            {showPreviewResponse ? "Hide" : "Show"} Responses
          </button>
        </div>
        <div className="answer-choice-wrapper">
          <MultipleChoice
            answers={previewQuestion.choices}
            correct={previewQuestion.correct}
            responses={["20%", "30%", "50%"]}
            showPreviewResponse={showPreviewResponse}
            showCorrectPreviewResponse={showCorrectPreviewResponse}
          />
        </div>
      </div>
      <div className="option-buttons">
        <button className="present-button">&#9658;&nbsp;Present</button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default QuestionPreview;
