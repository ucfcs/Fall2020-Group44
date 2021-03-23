import React, { useState, useContext, ReactElement } from "react";
import "./creator.scss";
import { store } from "../../store";
import CreatorEdit from "./creator-edit/creator-edit";
import CreatorPreview from "./creator-preview/creator-preview";
import Modal from "../modal/modal";

//todo: create question props

const Creator = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!newQuestion.title) {
      newQuestion.title = newQuestion.question;
    }
    closePreviewQuestion();
  };

  return (
    <Modal>
      <form className="create-question-module" onSubmit={saveQuestion}>
        <div className="creator-header">
          <button className="exit" onClick={closePreviewQuestion}>
            ×
          </button>
          <span className="header-title">Create Question</span>
          <div className="header-tabs">
            <div
              className={`tab-buttons edit-tab ${isPreview ? "" : "selected"}`}
              onClick={() => setIsPreview(false)}
            >
              Edit
            </div>
            <div
              className={`tab-buttons preview-tab ${
                isPreview ? "selected" : ""
              }`}
              onClick={() => setIsPreview(true)}
            >
              Preview
            </div>
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
    </Modal>
  );
};

export default Creator;
