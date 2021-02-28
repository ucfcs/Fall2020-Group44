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
      <span className="question">{previewQuestion.question}</span>
      <div className="response-buttons">
        <button
          className="show-correct-response"
          onClick={toggleShowCorrectResponse}
        >
          {showCorrectPreviewResponse ? "Hide" : "Show"} Correct Response{" "}
          <span>&#10003;</span>
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
  ) : (
    <div></div>
  );
};

export default QuestionPreview;
