import React, { useContext, SyntheticEvent, ReactElement } from "react";
import MultipleChoice from "../multiple-choice/multiple-choice";
import { store } from "../../../store";
import "./creator-edit.scss";
import { Folder, Question } from "../../../types";

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
      folderId = state.questions[value].id;
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

  const handleTypeChange = (event: SyntheticEvent): void => {
    const value: number = parseInt((event.target as HTMLInputElement).value);

    const tempQuestion = {
      ...question,
      type: value,
    };

    dispatch({
      type: "set-current-question-info",
      payload: tempQuestion,
    });
  };

  const updateParticipation = (event: SyntheticEvent): void => {
    const value = (event.target as HTMLInputElement).value;
    const tempQuestion = {
      ...question,
      participationPoints: value,
    };

    dispatch({ type: "set-current-question-info", payload: tempQuestion });
  };

  const updateCorrectness = (event: SyntheticEvent): void => {
    const value = (event.target as HTMLInputElement).value;
    const tempQuestion = {
      ...question,
      correctnessPoints: value,
    };

    dispatch({ type: "set-current-question-info", payload: tempQuestion });
  };

  const previewQuestion: Question = state.editPreviewQuestion
    ? state.questions[state.previewFolder].Questions[state.previewQuestion]
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
          <label htmlFor="question-type">
            <span className="red">*</span> Type:
          </label>

          <select
            className="question-type"
            name="question-type"
            id="question-type"
            disabled
            tabIndex={0}
            onChange={handleTypeChange}
          >
            <option value="Mult Choice">Multiple Choice</option>
          </select>
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
            tabIndex={0}
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
            tabIndex={0}
            defaultValue={-1}
            onChange={handleFolderChange}
          >
            {state.questions.map((folder: Folder, fIndex: number) => (
              <option key={fIndex} value={folder.name ? fIndex : -1}>
                {folder.name || "--None--"}
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
            <label htmlFor="participation-input">Participation Points:</label>

            <input
              id="participation-input"
              type="number"
              tabIndex={0}
              onChange={updateParticipation}
              value={state.currentQuestionInfo.participationPoints}
              step="0.1"
              min="0.0"
            />
          </div>

          <div className="correctness">
            <label htmlFor="correctness-input">Correctness Points:</label>

            <input
              id="correctness-input"
              type="number"
              tabIndex={0}
              onChange={updateCorrectness}
              value={state.currentQuestionInfo.correctnessPoints}
              step="0.1"
              min="0.0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorEdit;
