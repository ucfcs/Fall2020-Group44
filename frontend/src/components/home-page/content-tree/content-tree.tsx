import React, {
  useState,
  useContext,
  ReactElement,
  MouseEvent,
  SyntheticEvent,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { store } from "../../../store";
import { Folder, Question } from "../../../types";
import { putData, sendDelete } from "../../../util/api";
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
  const url = `${process.env.REACT_APP_REST_URL}/dev/api/v1`;
  const folderUrl = `${url}/folder`;
  const questionUrl = `${url}/question`;

  // Array of booleans indicating whether each folder is collapsed
  const [folderCollapse, setFolderCollapse] = useState(
    new Array(questions.length).fill(false)
  );

  const handleUpdatePreviewQuestion = (folder: number, question: number) => {
    setSelectedPreviewQuestion([folder, question]);

    dispatch({
      type: "update-preview-folder",
      payload: folder,
    });

    dispatch({
      type: "update-preview-question",
      payload: question,
    });
  };

  const handleFolderCollapse = (folder: number) => {
    const newFolderCollapse = folderCollapse.slice();
    newFolderCollapse[folder] = !newFolderCollapse[folder];
    setFolderCollapse(newFolderCollapse);
  };

  // const searchQuestions = (event: SyntheticEvent) => {
  //   const newFolders: Folder[] = [];

  //   state.questions.forEach((folder: Folder) => {
  //     const newQuestions: Question[] = [];

  //     folder.Questions.forEach((question) => {
  //       if (
  //         question.title
  //           .toLowerCase()
  //           .includes((event.target as HTMLInputElement).value.toLowerCase())
  //       ) {
  //         newQuestions.push(question);
  //       }
  //     });

  //     if (newQuestions.length) {
  //       newFolders.push({ name: folder.name, Questions: newQuestions });
  //     }
  //   });

  //   setQuestions(newFolders);
  // };

  const setFolderName = (e: SyntheticEvent, folder: number) => {
    const value: string = (e.target as HTMLInputElement).value;
    const oldFolder: Folder = questions[folder];

    putData(`${folderUrl}/${oldFolder.id}`, { ...oldFolder, name: value });

    dispatch({ type: "questions-need-update" });
  };

  const toggleEditQuestion = () => {
    dispatch({ type: "edit-preview-question" });
    dispatch({ type: "open-creator" });
  };

  const deleteQuestion = (
    event: SyntheticEvent,
    folderIndex: number,
    questionIndex: number
  ): void => {
    event.preventDefault();

    sendDelete(
      `${questionUrl}/${questions[folderIndex]["Questions"][questionIndex]["id"]}`
    )
      .then(() => {
        dispatch({ type: "questions-need-update" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editFolder = (e: MouseEvent, folder: number) => {
    e.stopPropagation();

    const newQuestions = questions;
    questions[folder].name = "";

    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  const deleteFolder = (e: MouseEvent, folder: number) => {
    e.preventDefault();

    const oldFolder: Folder = questions[folder];
    const id: number | undefined = oldFolder.id;

    if (id !== undefined) {
      sendDelete(`${folderUrl}/${id}`);

      dispatch({ type: "questions-need-update" });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      const questions: Folder[] = state.questions;

      if (
        result.source.droppableId === "folders" &&
        result.destination.droppableId === "folders"
      ) {
        // currently not supported by the backend, but this will control the ordering
        // of folders.
        return;
      } else {
        const srcFolder: number = parseInt(
          result.source.droppableId.split("folder")[1]
        );

        const destFolder: number = parseInt(
          result.destination.droppableId.split("folder")[1]
        );
        const destId: number | undefined = questions[destFolder].id;

        const question: Question =
          questions[srcFolder].Questions[result.source.index];

        putData(`${questionUrl}/${question.id}`, {
          ...question,
          folderId: destId,
        })
          .then(() => {
            dispatch({ type: "questions-need-update" });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  return (
    <div className="content-tree">
      {/* <div className="tree-options">
        <input
          type="text"
          tabIndex={0}
          className="input-box"
          placeholder="Search..."
          onChange={searchQuestions}
        />

        <button className="filter-button">Filter</button>
      </div> */}

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

      <div className="question-list">
        <div>
          <div className="question-list-header">
            <span className="title">Title</span>

            <span />

            <span className="type">Type</span>
          </div>

          <div className="question-list-body">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="folders" type="droppableItem">
                {(provided) => (
                  <div ref={provided.innerRef}>
                    {questions.map((folder: Folder, fIndex: number) =>
                      folder.name !== null ? (
                        <Draggable
                          key={fIndex}
                          draggableId={fIndex + ""}
                          index={fIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Droppable
                                droppableId={"folder" + fIndex}
                                type={`droppableSubItem`}
                              >
                                {(provided) => (
                                  <div ref={provided.innerRef} key={fIndex}>
                                    <div
                                      className={`folder ${
                                        folderCollapse[fIndex]
                                          ? "collapsed"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleFolderCollapse(fIndex)
                                      }
                                    >
                                      {folder.name === "" ? (
                                        <input
                                          type="text"
                                          onBlur={(e) =>
                                            setFolderName(e, fIndex)
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                          onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                              setFolderName(e, fIndex);
                                            }
                                          }}
                                        />
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
                                                deleteFolder(e, fIndex);
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
                                    {folder.Questions.map(
                                      (question, qIndex) => (
                                        <div key={fIndex + "-" + qIndex}>
                                          <Draggable
                                            draggableId={fIndex + "-" + qIndex}
                                            index={qIndex}
                                          >
                                            {(provided) => (
                                              <div
                                                key={fIndex + "-" + qIndex}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`preview-question ${
                                                  selectedPreviewQuestion[0] ===
                                                    fIndex &&
                                                  selectedPreviewQuestion[1] ===
                                                    qIndex
                                                    ? "selected"
                                                    : ""
                                                } ${
                                                  folderCollapse[fIndex]
                                                    ? "collapsed-item"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleUpdatePreviewQuestion(
                                                    fIndex,
                                                    qIndex
                                                  )
                                                }
                                              >
                                                <div className="title">
                                                  {question.title}
                                                </div>

                                                <div />

                                                <div className="type">
                                                  {question.type}
                                                </div>

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
                                                      deleteQuestion(
                                                        e,
                                                        fIndex,
                                                        qIndex
                                                      );
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
                                            )}
                                          </Draggable>
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <Droppable
                          key={fIndex}
                          droppableId={"folder" + fIndex}
                          type={`droppableSubItem`}
                        >
                          {(provided) => (
                            <div ref={provided.innerRef} key={fIndex}>
                              <div className="rogue-question-separator"></div>
                              {folder.Questions.map((question, qIndex) => (
                                <Draggable
                                  key={qIndex}
                                  draggableId={fIndex + "-" + qIndex}
                                  index={qIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`preview-question rogue-question ${
                                        selectedPreviewQuestion[0] === fIndex &&
                                        selectedPreviewQuestion[1] === qIndex
                                          ? "selected"
                                          : ""
                                      } ${
                                        folderCollapse[fIndex]
                                          ? "collapsed-item"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleUpdatePreviewQuestion(
                                          fIndex,
                                          qIndex
                                        )
                                      }
                                    >
                                      <div className="title">
                                        {question.title}
                                      </div>

                                      <div />

                                      <div className="type">
                                        {question.type}
                                      </div>

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
                                            deleteQuestion(e, fIndex, qIndex);
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
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
