import React, {
  useState,
  useContext,
  ReactElement,
  MouseEvent,
  SyntheticEvent,
} from "react";
import { store } from "../../../store";
import { Folder, Question, ServerResponse } from "../../../types";
import {
  catchError,
  deleteFolder,
  deleteQuestion,
  getFolders,
  updateFolder,
  updateQuestion,
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

  // Array of booleans indicating whether each folder is collapsed
  const [folderCollapse, setFolderCollapse] = useState(
    new Array(questions.length).fill(false)
  );

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

  const searchQuestions = (event: SyntheticEvent) => {
    // needs to be updated to search using the backend in preparation for lazy loading
    return;
    // const newFolders: Folder[] = [];

    // state.questions.forEach((folder: Folder) => {
    //   const newQuestions: Question[] = [];

    //   folder.Questions.forEach((question) => {
    //     if (
    //       question.title
    //         .toLowerCase()
    //         .includes((event.target as HTMLInputElement).value.toLowerCase())
    //     ) {
    //       newQuestions.push(question);
    //     }
    //   });

    //   if (newQuestions.length) {
    //     newFolders.push({ name: folder.name, Questions: newQuestions });
    //   }
    // });

    // setQuestions(newFolders);
  };

  const setFolderName = (e: SyntheticEvent, folder: number) => {
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
    e.stopPropagation();

    const newQuestions = questions;
    questions[folder].name = "";

    dispatch({ type: "update-session-questions", payload: newQuestions });
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
      .then((json: ServerResponse) => {
        dispatch({
          type: "update-questions",
          payload: [...json.folders, { name: null, Questions: json.questions }],
        });
      })
      .catch(catchError);
  };

  return (
    <div className="content-tree">
      <div className="tree-options">
        <input
          type="text"
          tabIndex={0}
          className="input-box"
          placeholder="Search..."
          onChange={searchQuestions}
        />

        <button className="filter-button">Filter</button>
      </div>

      <div className="create-buttons">
        <button
          className="create-question-button"
          onClick={() => dispatch({ type: "open-creator" })}
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
                  <div>
                    <div key={fIndex}>
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
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
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
                            } ${
                              folderCollapse[fIndex] ? "collapsed-item" : ""
                            }`}
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
                          <button onClick={toggleEditQuestion}>
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

export default ContentTree;
