import React, { useState, useContext, ReactElement } from "react";
import "./question-preview.scss";
import { store } from "../../../store";
import MultipleChoice from "../question-types/multiple-choice";

const QuestionPreview = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
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

  const previewFolder = state.questions[state.previewFolder].folder;

  return previewQuestion ? (
    <div className="question-preview">
      <div className="question-preview__info">
        <div className="question-preview__folder">
          <svg
            className="folder-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -1 24 24"
            width="24"
          >
            <path d="M448.916,118.259h-162.05c-6.578,0-13.003-2.701-17.44-7.292l-50.563-53.264c-12.154-12.115-28.783-18.443-45.625-18.346    H63.084C28.301,39.356,0,67.657,0,102.439v307.123c0,34.783,28.301,63.084,63.084,63.084h386.064h0.058    c34.764-0.154,62.949-28.59,62.794-63.277V181.342C512,146.559,483.699,118.259,448.916,118.259z M473.417,409.447    c0.058,13.504-10.88,24.558-24.307,24.616H63.084c-13.504,0-24.5-10.996-24.5-24.5V102.439c0-13.504,10.996-24.5,24.5-24.52    H173.74c0.212,0,0.424,0,0.637,0c6.443,0,12.694,2.566,16.899,6.733l50.293,53.013c11.806,12.192,28.32,19.176,45.297,19.176    h162.05c13.504,0,24.5,10.996,24.5,24.5V409.447z" />
          </svg>

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

          <button className="see-responses" onClick={toggleShowResponse}>
            {showPreviewResponse ? "Hide" : "Show"} Responses
          </button>
        </div>

        <div className="answer-choice-wrapper">
          <MultipleChoice
            answers={previewQuestion.questionOptions}
            responses={["20%", "30%", "50%"]}
            showPreviewResponse={showPreviewResponse}
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
