import React, { useState, useContext, ReactElement, FormEvent } from "react";
import { store } from "../../../store";
import "./folder-modal.scss";

interface Folder {
  folder: string;
  questions: Question[];
}

interface Question {
  title: string;
  type: string;
}

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

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
          <input
            className="folder-name"
            type="text"
            onChange={(e) => {
              setNewFolder(e.target.value);
            }}
          />
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
          Confirm
        </button>
      </div>
    </form>
  );
};

export default FolderModal;
