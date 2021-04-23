import React, {
  useState,
  useContext,
  ReactElement,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useRef,
} from "react";
import { store } from "../../../store";
import { Folder, FolderAndQuestionResponse } from "../../../types";
import {
  catchError,
  deleteFolder,
  deleteQuestion,
  getFolders,
  updateFolder,
} from "../../../util/api";
import "./content-tree.scss";

const ContentTree = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [selectedPreviewQuestion, setSelectedPreviewQuestion] = useState([
    state.previewFolder,
    state.previewQuestion,
  ]);

  const questions: Folder[] = state.questions;

  const inputRefs = useRef<HTMLDivElement[]>([]);

  // Array of booleans indicating whether each folder is collapsed
  const [folderCollapse, setFolderCollapse] = useState(
    new Array(questions.length).fill(false)
  );

  const [folderUnderEdit, setFolderUnderEdit] = useState<TempFolder>({
    folder: -1,
    value: "",
  });

  const resetFolderUnderEdit = () => {
    setFolderUnderEdit({
      folder: -1,
      value: "",
    });
  };

  // Property 'path' does not exist on type 'MouseEvent'.ts ??????
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelEditFolder = (e: any) => {
    if (
      folderUnderEdit.folder !== -1 &&
      !e.path.includes(inputRefs.current[folderUnderEdit.folder])
    ) {
      questions[folderUnderEdit.folder].name = folderUnderEdit.value;

      dispatch({
        type: "update-session-questions",
        payload: questions,
      });

      resetFolderUnderEdit();
    }
  };

  useEffect(() => {
    const funcWrapper = function (this: Window, ev: Event) {
      cancelEditFolder(ev);
    };
    window.addEventListener("click", funcWrapper, true);

    return () => window.removeEventListener("click", funcWrapper, true);
  }, [folderUnderEdit]);

  const handleUpdatePreviewQuestion = (
    folderIndex: number,
    questionIndex: number
  ) => {
    setSelectedPreviewQuestion([folderIndex, questionIndex]);

    dispatch({
      type: "update-preview-folder",
      payload: folderIndex,
    });

    dispatch({
      type: "update-preview-question",
      payload: questionIndex,
    });
  };

  const handleFolderCollapse = (folder: number) => {
    const newFolderCollapse = folderCollapse.slice();
    newFolderCollapse[folder] = !newFolderCollapse[folder];
    setFolderCollapse(newFolderCollapse);
  };

  const setFolderName = (e: SyntheticEvent, folder: number) => {
    resetFolderUnderEdit();

    const value: string = (e.target as HTMLInputElement).value;
    const oldFolder: Folder = questions[folder];
    const id: number | undefined = oldFolder.id;

    if (id !== undefined) {
      updateFolder(id, { ...oldFolder, name: value }, state.jwt)
        .then(updateFolders)
        .catch(catchError);
    }
  };

  const toggleEditQuestion = () => {
    dispatch({ type: "edit-preview-question" });
    dispatch({ type: "open-creator" });
  };

  const deleteQuestionLocal = (
    event: SyntheticEvent,
    folderIndex: number,
    questionIndex: number
  ): void => {
    event.preventDefault();
    const id: number | undefined =
      questions[folderIndex].Questions[questionIndex].id;

    if (id === undefined) {
      return;
    }

    deleteQuestion(id, state.jwt).then(updateFolders).catch(catchError);
  };

  const editFolder = (e: MouseEvent, folder: number) => {
    setFolderUnderEdit({
      folder,
      value: questions[folder].name,
    });

    questions[folder].name = "";
    dispatch({ type: "update-session-questions", payload: questions });
  };

  const deleteFolderLocal = (e: MouseEvent, folder: number) => {
    e.preventDefault();

    const oldFolder: Folder = questions[folder];
    const id: number | undefined = oldFolder.id;

    if (id !== undefined) {
      deleteFolder(id, state.jwt).then(updateFolders).catch(catchError);
    }
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
    <div className="content-tree">
      <div className="create-buttons">
        <button
          className="create-question-button"
          onClick={() => {
            dispatch({ type: "open-creator" });
            dispatch({
              type: "update-creator-module-folder-index",
              payload: -1,
            });
          }}
        >
          Question
        </button>

        <button
          className="create-folder-button"
          onClick={() => dispatch({ type: "open-folder" })}
        >
          Folder
        </button>
      </div>

      <div className="question-list-header">
        <span className="title">Title</span>

        <span />

        <span className="type">Type</span>
      </div>
      <div className="question-list">
        <div>
          <div className="question-list-body">
            <div>
              {questions.map((folder: Folder, fIndex: number) =>
                folder.name !== null ? (
                  <div
                    key={fIndex}
                    ref={(e) => {
                      if (e) {
                        inputRefs.current[fIndex] = e;
                      }
                    }}
                  >
                    <div
                      className={`folder ${
                        folderCollapse[fIndex] ? "collapsed" : ""
                      }`}
                      onClick={() => handleFolderCollapse(fIndex)}
                    >
                      {folder.name === "" ? (
                        <>
                          <label
                            htmlFor={`folder-name-${fIndex}`}
                            className="folder-name-label"
                          >
                            Name:{" "}
                          </label>
                          <input
                            type="text"
                            id={`folder-name-${fIndex}`}
                            defaultValue={questions[fIndex].name}
                            autoComplete="off"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                setFolderName(e, fIndex);
                              }
                            }}
                          />{" "}
                        </>
                      ) : (
                        <div className="folder-item">
                          <div className="dropdown">
                            {folderCollapse[fIndex] ? (
                              <img
                                src="/img/dropdown-closed.svg"
                                alt="Closed dropdown"
                                className="dropdown-closed"
                              />
                            ) : (
                              <img
                                src="/img/dropdown-open.svg"
                                alt="Open dropdown"
                                className="dropdown-open"
                              />
                            )}
                          </div>

                          <div />

                          <img
                            className="folder-icon"
                            src="/img/folder-icon.svg"
                            alt=""
                          />

                          <div />

                          <span>{folder.name}</span>

                          <div className="content-tree-icons">
                            <button
                              onClick={(e) => {
                                editFolder(e, fIndex);
                              }}
                            >
                              <img
                                className="content-tree-icon"
                                alt="Edit"
                                src="/img/edit.svg"
                              />
                            </button>

                            <button
                              className="delete-button"
                              onClick={(e) => {
                                deleteFolderLocal(e, fIndex);
                              }}
                            >
                              <img
                                className="content-tree-icon"
                                alt="Delete"
                                src="/img/delete.svg"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {folder.Questions.map((question, qIndex) => (
                      <div key={fIndex + "-" + qIndex}>
                        <div
                          key={fIndex + "-" + qIndex}
                          className={`preview-question ${
                            selectedPreviewQuestion[0] === fIndex &&
                            selectedPreviewQuestion[1] === qIndex
                              ? "selected"
                              : ""
                          } ${folderCollapse[fIndex] ? "collapsed-item" : ""}`}
                          onClick={() =>
                            handleUpdatePreviewQuestion(fIndex, qIndex)
                          }
                        >
                          <div className="title">{question.title}</div>

                          <div />

                          <div className="type">{question.type}</div>

                          <div className="content-tree-icons">
                            <button
                              onClick={() => {
                                handleUpdatePreviewQuestion(fIndex, qIndex);
                                dispatch({
                                  type: "update-creator-module-folder-index",
                                  payload: fIndex,
                                });
                                toggleEditQuestion();
                              }}
                            >
                              <img
                                className="content-tree-icon"
                                alt="Edit"
                                src="/img/edit.svg"
                              />
                            </button>

                            <button
                              onClick={(e) => {
                                deleteQuestionLocal(e, fIndex, qIndex);
                              }}
                              className="delete-button"
                            >
                              <img
                                className="content-tree-icon"
                                alt="Delete"
                                src="/img/delete.svg"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div key={fIndex}>
                    <div className="rogue-question-separator"></div>
                    {folder.Questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className={`preview-question rogue-question ${
                          selectedPreviewQuestion[0] === fIndex &&
                          selectedPreviewQuestion[1] === qIndex
                            ? "selected"
                            : ""
                        } ${folderCollapse[fIndex] ? "collapsed-item" : ""}`}
                        onClick={() =>
                          handleUpdatePreviewQuestion(fIndex, qIndex)
                        }
                      >
                        <div className="title">{question.title}</div>

                        <div />

                        <div className="type">{question.type}</div>

                        <div className="content-tree-icons">
                          <button
                            onClick={() => {
                              dispatch({
                                type: "update-creator-module-folder-index",
                                payload: -1,
                              });
                              toggleEditQuestion();
                            }}
                          >
                            <img
                              className="content-tree-icon"
                              alt="Edit"
                              src="/img/edit.svg"
                            />
                          </button>

                          <button
                            onClick={(e) => {
                              deleteQuestionLocal(e, fIndex, qIndex);
                            }}
                            className="delete-button"
                          >
                            <img
                              className="content-tree-icon"
                              alt="Delete"
                              src="/img/delete.svg"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <button
          className="present-button"
          onClick={() => dispatch({ type: "open-question-select" })}
        >
          &#9658;&nbsp;Present
        </button>
      </div>
    </div>
  );
};

interface TempFolder {
  folder: number;
  value: string;
}

export default ContentTree;
