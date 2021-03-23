import React, {
  useState,
  useContext,
  ReactElement,
  useLayoutEffect,
} from "react";
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

  const [firstLoad, setFirstLoad] = useState(true);
  useLayoutEffect((): void => {
    if (firstLoad) {
      if (state.editPreviewQuestion) {
        dispatch({
          type: "set-current-question-info",
          payload:
            state.questions[state.previewFolder].questions[
              state.previewQuestion
            ],
        });
      }

      setFirstLoad(false);
    }
  }, [state.editPreviewQuestion]);

  const [isPreview, setIsPreview] = useState(false);
  const questionInfo: Question = state.currentQuestionInfo;

  const closePreviewQuestion = (): void => {
    dispatch({ type: "close-preview-question" });
    dispatch({ type: "close-creator" });
    dispatch({ type: "reset-current-question-info" });
  };

  const saveQuestion = () => {
    const info = { ...questionInfo };

    if (!info.title) {
      info.title = info.question;
    }

    if (state.editPreviewQuestion) {
      const id =
        state.questions[state.previewFolder].questions[state.previewQuestion][
          "id"
        ];

      try {
        putData(`${url}/${id}`, {
          ...info,
          courseId: state.courseId,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        postData(url, { ...info, courseId: state.courseId });
      } catch (error) {
        console.error(error);
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
