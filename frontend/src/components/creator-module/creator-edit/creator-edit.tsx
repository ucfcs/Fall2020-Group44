import React, { useContext, SyntheticEvent, ReactElement } from "react";
import MultipleChoice from "../creator-answer-types/multiple-choice";
import { store } from "../../../store";
import "./creator-edit.scss";

//TODO: create question props

interface Prop {
  newQuestion: Question;
  setNewQuestion: (arg0: Question) => void;
}

interface Question {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

interface Folder {
  folder: string;
  questions: Question[];
}

const CreatorEdit = ({ newQuestion, setNewQuestion }: Prop): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  const handleTitleChange = (e: SyntheticEvent) => {
    const tempQuestion = {
      ...newQuestion,
      title: (e.target as HTMLInputElement).value,
    };
    setNewQuestion(tempQuestion);
  };

  const handleQuestionChange = (e: SyntheticEvent) => {
    const tempQuestion = {
      ...newQuestion,
      question: (e.target as HTMLInputElement).value,
    };
    setNewQuestion(tempQuestion);
  };

  const previewQuestion = state.editPreviewQuestion
    ? state.questions[state.previewFolder].questions[state.previewQuestion]
    : newQuestion;

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
          >
            {state.questions.map((folder: Folder, fIndex: number) => (
              <option key={fIndex} value={folder.folder ? fIndex : -1}>
                {folder.folder || "--None--"}
              </option>
            ))}
          </select>
        </div>
        <div className="question-answers">
          <MultipleChoice
            answers={previewQuestion.choices}
            correct={previewQuestion.correct}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
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

export default CreatorEdit;
