import React, { useState, useContext, ReactElement, FormEvent } from "react";
import { store } from "../../../store";
import "./folder-modal.scss";

const FolderModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const [newFolder, setNewFolder] = useState("");

  const closeFolderModal = () => {
    dispatch({ type: "close-folder" });
    console.log("closeFolderModal");
  };

  const handleFolderCreation = (e: FormEvent) => {
    e.preventDefault();
    const newQuestions = state.questions;
    const questionsLength = newQuestions.length;
    newQuestions.splice(
      questionsLength - (newQuestions[questionsLength - 1].folder ? 0 : 1),
      0,
      {
        folder: newFolder,
        questions: [],
      }
    );
    console.log(newQuestions);
    dispatch({ type: "update-questions", payload: newQuestions });
    closeFolderModal();
  };

  return (
    <form className="folder-module" onSubmit={handleFolderCreation}>
      <div className="creator-header">
        <button type="reset" className="exit" onClick={closeFolderModal}>
          ×
        </button>
        <span className="header-title">Create Folder</span>
      </div>
      <div className="question-select-body">
        <div className="question-details">
          <div className="folder-info">
            <label htmlFor="folder-name">Folder Name: </label>
            <input
              id="folder-name"
              className="folder-name"
              type="text"
              placeholder="eg: Chapter 5"
              onChange={(e) => {
                setNewFolder(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          type="reset"
          className="cancel-button"
          onClick={closeFolderModal}
        >
          Cancel
        </button>
        <button type="submit" className="save-button">
          Create
        </button>
      </div>
    </form>
  );
};

export default FolderModal;
