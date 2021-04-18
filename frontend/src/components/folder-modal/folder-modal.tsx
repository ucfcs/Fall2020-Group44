import React, { useState, useContext, ReactElement, FormEvent } from "react";
import { store } from "../../store";
import { FolderAndQuestionResponse } from "../../types";
import { catchError, createFolder, getFolders } from "../../util/api";
import Modal from "../modal/modal";
import "./folder-modal.scss";

const FolderModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const [newFolder, setNewFolder] = useState("");

  const closeFolderModal = () => {
    dispatch({ type: "close-folder" });
  };

  const handleFolderCreation = (e: FormEvent) => {
    e.preventDefault();

    createFolder(
      {
        courseId: state.courseId,
        name: newFolder,
      },
      state.jwt
    )
      .then(() => {
        updateFolders();
        closeFolderModal();
      })
      .catch(catchError);
  };

  const updateFolders = (): void => {
    getFolders(state.courseId, state.jwt)
      .then((response) => {
        return response.json();
      })
      .then((json: FolderAndQuestionResponse) => {
        dispatch({
          type: "update-questions",
          payload: [...json.folders, { name: null, Questions: json.questions }],
        });
      })
      .catch(catchError);
  };

  return (
    <Modal>
      <form className="folder-module" onSubmit={handleFolderCreation}>
        <div className="creator-header">
          <button
            type="reset"
            className="exit"
            tabIndex={0}
            onClick={closeFolderModal}
          >
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
                tabIndex={0}
                value={newFolder}
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
            tabIndex={0}
            onClick={closeFolderModal}
          >
            Cancel
          </button>

          <button type="submit" className="save-button" tabIndex={0}>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FolderModal;
