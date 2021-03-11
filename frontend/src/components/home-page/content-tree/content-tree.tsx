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

interface Folder {
  folder: string;
  questions: Question[];
}

interface Question {
  title: string;
  type: string;
}

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

  const addFolder = () => {
    const newQuestions = questions;
    questions.push({
      folder: "",
      questions: [],
    });
    dispatch({ type: "update-session-questions", payload: newQuestions });
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

  const deleteQuestion = () => {
    console.log("deleteQuestion");
  };

  const editFolder = (e: MouseEvent, folder: number) => {
    e.stopPropagation();
    const newQuestions = questions;
    questions[folder].folder = "";
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  const deleteFolder = (e: MouseEvent, folder: number) => {
    e.stopPropagation();
    console.log("deleteFolder", folder);
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

  const truncate = (str: string) => {
    return str.length > 50 ? str.substr(0, 48) + "..." : str;
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
        <button className="create-folder-button" onClick={addFolder}>
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
                                          {folderCollapse[fIndex] ? (
                                            <svg
                                              className="folder-icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="24"
                                              viewBox="0 -1 24 24"
                                              width="24"
                                            >
                                              <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z" />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="folder-icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="24"
                                              viewBox="0 -1 24 24"
                                              width="24"
                                            >
                                              <path d="M484.132,124.986l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86c-7.208,0-13.964,2.792-19.036,7.86l-183.84,183.848    L62.056,108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968,2.788-19.036,7.856l-16.12,16.128    c-10.496,10.488-10.496,27.572,0,38.06l219.136,219.924c5.064,5.064,11.812,8.632,19.084,8.632h0.084    c7.212,0,13.96-3.572,19.024-8.632l218.932-219.328c5.072-5.064,7.856-12.016,7.864-19.224    C491.996,136.902,489.204,130.046,484.132,124.986z" />
                                            </svg>
                                          )}
                                          <svg
                                            className="folder-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -1 24 24"
                                            width="24"
                                          >
                                            <path d="M448.916,118.259h-162.05c-6.578,0-13.003-2.701-17.44-7.292l-50.563-53.264c-12.154-12.115-28.783-18.443-45.625-18.346    H63.084C28.301,39.356,0,67.657,0,102.439v307.123c0,34.783,28.301,63.084,63.084,63.084h386.064h0.058    c34.764-0.154,62.949-28.59,62.794-63.277V181.342C512,146.559,483.699,118.259,448.916,118.259z M473.417,409.447    c0.058,13.504-10.88,24.558-24.307,24.616H63.084c-13.504,0-24.5-10.996-24.5-24.5V102.439c0-13.504,10.996-24.5,24.5-24.52    H173.74c0.212,0,0.424,0,0.637,0c6.443,0,12.694,2.566,16.899,6.733l50.293,53.013c11.806,12.192,28.32,19.176,45.297,19.176    h162.05c13.504,0,24.5,10.996,24.5,24.5V409.447z" />
                                          </svg>
                                          <span>{folder.folder}</span>
                                          <div className="content-tree-icons">
                                            <svg
                                              className="content-tree-icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="24"
                                              viewBox="0 -1 24 24"
                                              width="24"
                                              onClick={(e) =>
                                                editFolder(e, fIndex)
                                              }
                                            >
                                              <path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" />
                                              <path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" />
                                            </svg>
                                            <svg
                                              className="content-tree-icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              width="24"
                                              onClick={(e) =>
                                                deleteFolder(e, fIndex)
                                              }
                                            >
                                              <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                              <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                              <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                              <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                            </svg>
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
                                                  {truncate(question.title)}
                                                </div>
                                                <div></div>
                                                <div className="type">
                                                  {question.type}
                                                </div>
                                                <div className="content-tree-icons">
                                                  <svg
                                                    className="content-tree-icon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24"
                                                    viewBox="0 -1 24 24"
                                                    width="24"
                                                    onClick={toggleEditQuestion}
                                                  >
                                                    <path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" />
                                                    <path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" />
                                                  </svg>
                                                  <svg
                                                    className="content-tree-icon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    onClick={deleteQuestion}
                                                  >
                                                    <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                    <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                    <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                                    <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                                  </svg>
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
                                      <div></div>
                                      <div className="type">
                                        {question.type}
                                      </div>
                                      <div className="content-tree-icons">
                                        <svg
                                          className="content-tree-icon"
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          viewBox="0 -1 24 24"
                                          width="24"
                                          onClick={toggleEditQuestion}
                                        >
                                          <path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" />
                                          <path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" />
                                        </svg>
                                        <svg
                                          className="content-tree-icon"
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          width="24"
                                          onClick={deleteQuestion}
                                        >
                                          <path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                          <path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                          <path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0" />
                                          <path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0" />
                                        </svg>
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
