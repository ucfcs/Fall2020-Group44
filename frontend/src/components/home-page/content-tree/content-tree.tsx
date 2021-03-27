import React, {
  useState,
  useEffect,
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

  const [questions, setQuestions] = useState(state.questions);

  useEffect(() => {
    setQuestions(state.questions);
  }, [state.questions]);

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

  const searchQuestions = (event: SyntheticEvent) => {
    const newFolders: Folder[] = [];
    state.questions.forEach((folder: Folder) => {
      const newQuestions: Question[] = [];
      folder.questions.forEach((question) => {
        if (
          question.title
            .toLowerCase()
            .includes((event.target as HTMLInputElement).value.toLowerCase())
        ) {
          newQuestions.push(question);
        }
      });
      if (newQuestions.length) {
        newFolders.push({ folder: folder.folder, questions: newQuestions });
      }
    });
    setQuestions(newFolders);
  };

  const setFolderName = (e: SyntheticEvent, folder: number) => {
    const newQuestions = questions;
    questions[folder].folder = (e.target as HTMLInputElement).value;
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  const toggleEditQuestion = () => {
    dispatch({ type: "edit-preview-question" });
    dispatch({ type: "open-creator" });
  };

  const deleteQuestion = (): void => {
    return;
  };

  const editFolder = (e: MouseEvent, folder: number) => {
    e.stopPropagation();
    const newQuestions = questions;
    questions[folder].folder = "";
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  const deleteFolder = (e: MouseEvent, folder: number) => {
    e.stopPropagation();
  };

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      const newQuestions = state.questions;

      if (
        result.source.droppableId === "folders" &&
        result.destination.droppableId === "folders"
      ) {
        const [srcFolder] = newQuestions.splice(result.source.index, 1);

        newQuestions.splice(result.destination.index, 0, srcFolder);
      } else {
        const srcFolder = result.source.droppableId.split("folder")[1];
        const destFolder = result.destination.droppableId.split("folder")[1];
        const [srcQuestion] = newQuestions[srcFolder].questions.splice(
          result.source.index,
          1
        );

        newQuestions[destFolder].questions.splice(
          result.destination.index,
          0,
          srcQuestion
        );
      }
    }
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

      <div className="question-list">
        <div>
          <div className="question-list-header">
            <span className="title">Title</span>

            <span></span>

            <span className="type">Type</span>
          </div>

          <div className="question-list-body">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="folders" type="droppableItem">
                {(provided) => (
                  <div ref={provided.innerRef}>
                    {questions.map((folder: Folder, fIndex: number) =>
                      folder.folder !== null ? (
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
                                      {folder.folder === "" ? (
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

                                          <span>{folder.folder}</span>

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
                                    {folder.questions.map(
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
                                                    onClick={toggleEditQuestion}
                                                  >
                                                    <img
                                                      className="content-tree-icon"
                                                      alt="Edit"
                                                      src="/img/edit.svg"
                                                    />
                                                  </button>

                                                  <button
                                                    onClick={deleteQuestion}
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
                              {folder.questions.map((question, qIndex) => (
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
                                          onClick={deleteQuestion}
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

interface Folder {
  folder: string;
  questions: Question[];
}

interface Question {
  title: string;
  type: string;
}

export default ContentTree;
