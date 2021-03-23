import React, { useContext, SyntheticEvent, ReactElement } from "react";
import MultipleChoice from "../multiple-choice/multiple-choice";
import { store } from "../../../store";
import "./creator-edit.scss";
import { Question } from "../../../types";

//TODO: create question props

const CreatorEdit = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const question: Question = state.currentQuestionInfo;

  const handleTitleChange = (event: SyntheticEvent): void => {
    const tempQuestion = {
      ...question,
      title: (event.target as HTMLInputElement).value,
    };

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const handleQuestionChange = (event: SyntheticEvent): void => {
    const tempQuestion = {
      ...question,
      question: (event.target as HTMLInputElement).value,
    };

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const handleFolderChange = (event: SyntheticEvent): void => {
    const value: number = parseInt((event.target as HTMLInputElement).value);
    let folderId: number | null;

    if (value === -1) {
      folderId = null;
    } else {
      folderId = state.questions[value].folder.id;
    }

    const tempQuestion = {
      ...question,
      folderId: folderId,
    };

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const previewQuestion = state.editPreviewQuestion
    ? state.questions[state.previewFolder].questions[state.previewQuestion]
    : question;

  return (
    <div className="creator-body">
      <div className="question-details">
        <div className="question-details-header">
          <span>
            Question Details (<span className="red">*</span> indicates required
            fields)
          </span>
        </div>

        <div className="question-info">
          <label htmlFor="question-title">Title:</label>

          <input
            id="question-title"
            type="text"
            tabIndex={0}
            maxLength={120}
            className="question-title-input"
            placeholder="eg: US History 1a"
            defaultValue={previewQuestion.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="question-info">
          <label htmlFor="question-text">
            <span className="red">*</span> Question:
          </label>

          <input
            id="question-text"
            type="text"
            required
            tabIndex={1}
            className="question-text-input"
            placeholder="eg: Who was the first President of the United States?"
            defaultValue={previewQuestion.question}
            onChange={handleQuestionChange}
          />
        </div>

        <div className="question-info">
          <label htmlFor="folder-select">
            <span className="red"></span> Folder:
          </label>

          <select
            className="folder-select"
            name="folder-select"
            id="folder-select"
            defaultValue={-1}
            onChange={handleFolderChange}
          >
            {state.questions.map((folder: Folder, fIndex: number) => (
              <option key={fIndex} value={folder.folder ? fIndex : -1}>
                {folder.folder || "--None--"}
              </option>
            ))}
          </select>
        </div>

        <div className="question-answers">
          <MultipleChoice />
        </div>
      </div>

      <div className="question-options">
        <div className="question-options-header">
          <p>Question Options</p>
        </div>

        <div className="options-grading">
          <div className="participation">
            <span>Participation Points:</span>

            <input
              type="number"
              tabIndex={2}
              className="participation-input"
              placeholder="0.5"
              step="0.1"
              min="0.0"
            />
          </div>

          <div className="correctness">
            <span>Correctness Points:</span>

            <input
              type="number"
              tabIndex={2}
              className="correctness-input"
              placeholder="0.5"
              step="0.1"
              min="0.0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface Folder {
  folder: string;
  id: number;
  questions: Question[];
}

export default CreatorEdit;
