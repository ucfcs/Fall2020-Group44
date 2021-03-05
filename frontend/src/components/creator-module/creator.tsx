import React, { useState, useContext, ReactElement } from "react";
import { Link } from "react-router-dom";
import "./creator.scss";
import { store } from "../../store";
import CreatorEdit from "./creator-edit/creator-edit";
import CreatorPreview from "./creator-preview/creator-preview";

//todo: create question props

const Creator = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const [isPreview, setIsPreview] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    question: "",
    type: "Mult Choice",
    choices: ["", ""],
    correct: -1,
  });

  const closePreviewQuestion = () => {
    dispatch({ type: "close-preview-question" });
    dispatch({ type: "close-creator" });
  };

  const saveQuestion = () => {
    closePreviewQuestion();
    console.log("saveQuestion");
  };

  return (
    <form className="create-question-module" onSubmit={saveQuestion}>
      <div className="creator-header">
        <button className="exit" onClick={closePreviewQuestion}>
          ×
        </button>
        <span className="header-title">Create Question</span>
        <div className="header-tabs">
          <button
            className={`edit-tab ${isPreview ? "" : "selected"}`}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </button>
          <button
            className={`preview-tab ${isPreview ? "selected" : ""}`}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>
      {isPreview ? (
        <CreatorPreview newQuestion={newQuestion} />
      ) : (
        <CreatorEdit
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
        />
      )}
      <div className="buttons">
        <button
          type="reset"
          className="cancel-button"
          onClick={closePreviewQuestion}
        >
          Cancel
        </button>
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );
};

export default Creator;
