import React, {
  useState,
  useContext,
  ReactElement,
  useEffect,
  SyntheticEvent,
} from "react";
import "./creator.scss";
import { store } from "../../store";
import CreatorEdit from "./creator-edit/creator-edit";
import CreatorPreview from "./creator-preview/creator-preview";
import Modal from "../modal/modal";
import {
  catchError,
  createQuestion,
  getFolders,
  updateQuestion,
} from "../../util/api";
import { Question, ServerResponse } from "../../types";

//todo: create question props

const Creator = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect((): void => {
    if (firstLoad) {
      if (state.editPreviewQuestion) {
        dispatch({
          type: "set-current-question-info",
          payload:
            state.questions[state.previewFolder].Questions[
              state.previewQuestion
            ],
        });
      }

      setFirstLoad(false);
    }
  }, [
    dispatch,
    firstLoad,
    state.editPreviewQuestion,
    state.previewFolder,
    state.previewQuestion,
    state.questions,
  ]);

  const [isPreview, setIsPreview] = useState(false);
  const questionInfo: Question = state.currentQuestionInfo;

  const closePreviewQuestion = (): void => {
    dispatch({ type: "close-preview-question" });
    dispatch({ type: "close-creator" });
    dispatch({ type: "reset-current-question-info" });
  };

  const saveQuestion = (event: SyntheticEvent) => {
    event?.preventDefault();

    const info: Question = { ...questionInfo };

    if (!info.title) {
      info.title = info.question;
    }

    if (state.editPreviewQuestion) {
      const id =
        state.questions[state.previewFolder].Questions[state.previewQuestion][
          "id"
        ];

      updateQuestion(id, { ...info, courseId: state.courseId }, state.jwt)
        .then(updateAndClose)
        .catch(catchError);
    } else {
      createQuestion({ ...info, courseId: state.courseId }, state.jwt)
        .then(updateAndClose)
        .catch(catchError);
    }
  };

  const updateAndClose = (): void => {
    updateFolders();
    closePreviewQuestion();
  };

  const updateFolders = (): void => {
    getFolders(state.courseId, state.jwt)
      .then((response) => {
        return response.json();
      })
      .then((json: ServerResponse) => {
        dispatch({
          type: "update-questions",
          payload: [...json.folders, { name: null, Questions: json.questions }],
        });
      })
      .catch(catchError);
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
              tabIndex={0}
              onClick={() => setIsPreview(false)}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsPreview(false);
                }
              }}
            >
              Edit
            </div>
            <div
              className={`tab-buttons preview-tab ${
                isPreview ? "selected" : ""
              }`}
              tabIndex={0}
              onClick={() => setIsPreview(true)}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsPreview(true);
                }
              }}
            >
              Preview
            </div>
          </div>
        </div>
        {isPreview ? <CreatorPreview /> : <CreatorEdit />}
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
