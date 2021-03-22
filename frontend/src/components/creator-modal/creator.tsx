import React, { useState, useContext, ReactElement } from "react";
import "./creator.scss";
import { store } from "../../store";
import CreatorEdit from "./creator-edit/creator-edit";
import CreatorPreview from "./creator-preview/creator-preview";
import Modal from "../modal/modal";
import { postData, putData } from "../../util/api";
import { Question } from "../../types";

//todo: create question props

const Creator = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const url = `${process.env.REACT_APP_REST_URL}/dev/api/v1/question`;

  const [isPreview, setIsPreview] = useState(false);
  const [questionInfo, setQuestionInfo] = useState({
    title: "",
    question: "",
    type: "Mult Choice",
    questionOptions: [
      { text: "", isAnswer: false },
      { text: "", isAnswer: false },
    ],
    folderId: null,
  });

  const closePreviewQuestion = (): void => {
    dispatch({ type: "close-preview-question" });
    dispatch({ type: "close-creator" });
  };

  const saveQuestion = () => {
    if (!questionInfo.title) {
      setQuestionInfo({ ...questionInfo, title: questionInfo.question });
    }

    if (state.editPreviewQuestion) {
      try {
        putData(url, { ...questionInfo, courseId: state.courseId });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        postData(url, { ...questionInfo, courseId: state.courseId });
      } catch (error) {
        console.log(error);
      }
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
          <CreatorPreview question={questionInfo as Question} />
        ) : (
          <CreatorEdit
            question={questionInfo as Question}
            setQuestionInfo={setQuestionInfo as (arg0: Question) => void}
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
