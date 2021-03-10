import React, {
  useState,
  useContext,
  ReactElement,
  SyntheticEvent,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "./question-select.scss";

interface Folder {
  folder: string;
  questions: Question[];
}

interface Question {
  title: string;
  type: string;
}

interface PollQuestion {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

const QuestionSelect = (): ReactElement => {
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;
  const [isPreview, setIsPreview] = useState(false);

  const folderCheckboxRefs: HTMLInputElement[] = [];

  // an object containing refs of the checkbox of each question
  // key = index of the folders
  // data = arrays of checkbox refs from the questions in the folder
  const questionCheckboxRefs: { [key: number]: HTMLInputElement[] } = {};

  // organizing the questions to be presented in a session.
  // key = folder index
  // data = array of question indices
  const [sessionQuestions, setSessionQuestions] = useState(
    {} as { [key: string]: number[] }
  );

  const closeQuestionSelect = () => {
    dispatch({ type: "close-question-select" });
    dispatch({ type: "update-session-questions", payload: [] });
    console.log("closeQuestionSelect");
  };

  const presentQuestions = () => {
    dispatch({ type: "close-question-select" });
    console.log("presentQuestions");
  };

  const handleEditDragEnd = (result: DropResult) => {
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
        // wow this is infuriating
        // const newSessionQuestions = sessionQuestions;
        // if (newSessionQuestions[destFolder]) {
        //   newSessionQuestions[destFolder].forEach((question, index) => {
        //     if (result.destination && question >= result.destination.index) {
        //       newSessionQuestions[destFolder][index]++;
        //     }
        //   });
        // }
        // if (newSessionQuestions[srcFolder]) {
        //   newSessionQuestions[srcFolder].forEach((question, index) => {
        //     if (question >= result.source.index) {
        //       newSessionQuestions[srcFolder][index]--;
        //     }
        //   });
        // }
        // setSessionQuestions(newSessionQuestions);
      }
    }
  };

  const handlePreviewDragEnd = (result: DropResult) => {
    if (result.destination) {
      const newQuestions: PollQuestion[] = state.poll;
      const [srcQuestion] = newQuestions.splice(result.source.index, 1);
      newQuestions.splice(result.destination.index, 0, srcQuestion);
      dispatch({ type: "update-session-questions", payload: newQuestions });
    }
  };

  const selectQuestionsForPoll = (
    event: SyntheticEvent,
    isFolder: boolean,
    folder: number,
    question = -1
  ) => {
    event.stopPropagation();

    // if checking a checkbox
    if ((event.target as HTMLInputElement).checked) {
      // if it's a folder's checkbox
      if (isFolder) {
        // check all the questions in the folder
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = true;
          // console.log(checkbox.parentElement);
          if (checkbox.parentElement) {
            checkbox.parentElement.classList.add("selected");
          }
        });
        // push entire folder to session
        sessionQuestions[folder] = [
          ...Array(state.questions[folder].questions.length).keys(),
        ];
      }
      // if it's a single question
      else {
        const parentEl = questionCheckboxRefs[folder][question].parentElement;
        if (parentEl) {
          parentEl.classList.add("selected");
        }
        // see if all the questions in the folder are checked.
        let isAllChecked = true;
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          if (!checkbox.checked) isAllChecked = false;
        });
        // check the folder's checkbox if so
        if (isAllChecked && folderCheckboxRefs[folder]) {
          folderCheckboxRefs[folder].checked = true;
        }
        // push question and sort the question order within the folder
        if (!sessionQuestions[folder]) sessionQuestions[folder] = [];
        sessionQuestions[folder].push(question);
        sessionQuestions[folder].sort((a: number, b: number) => a - b);
      }
    }
    // if unchecking a checkbox
    else {
      // folder
      if (isFolder) {
        // uncheck all the questions in the folder
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = false;
          if (checkbox.parentElement) {
            checkbox.parentElement.classList.remove("selected");
          }
        });
        // delete all the questions in the folder from the session
        sessionQuestions[folder] = [];
      }
      // question
      else {
        const parentEl = questionCheckboxRefs[folder][question].parentElement;
        if (parentEl) {
          parentEl.classList.remove("selected");
        }
        // uncheck the folder
        if (folderCheckboxRefs[folder]) {
          folderCheckboxRefs[folder].checked = false;
        }
        // delete question from session.
        sessionQuestions[folder] = sessionQuestions[folder].filter(
          (q: number) => {
            return q !== question;
          }
        );
      }
      setSessionQuestions(sessionQuestions);
    }

    // Update the poll with the questions in sessionQuestions
    const newPoll: PollQuestion[] = [];
    Object.keys(sessionQuestions).forEach((f: string) => {
      sessionQuestions[f].forEach((q: number) => {
        newPoll.push(state.questions[f].questions[q]);
      });
    });
    dispatch({ type: "update-session-questions", payload: newPoll });
  };

  return (
    <div className="question-select-module">
      <div className="creator-header">
        <button type="reset" className="exit" onClick={closeQuestionSelect}>
          ×
        </button>
        <span className="header-title">Select Questions to Present</span>
        <div className="header-tabs">
          <div
            className={`tab-buttons edit-tab ${isPreview ? "" : "selected"}`}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </div>
          <div
            className={`tab-buttons preview-tab ${isPreview ? "selected" : ""}`}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </div>
        </div>
      </div>
      <div className="question-select-body">
        <div className="question-details">
          {isPreview ? (
            <div className="selected-list__wrapper">
              <DragDropContext onDragEnd={handlePreviewDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      className="selected-list__questions"
                      ref={provided.innerRef}
                    >
                      {state.poll.map(
                        (question: PollQuestion, index: number) => (
                          <Draggable
                            key={index}
                            draggableId={index + ""}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="selected-list__question"
                              >
                                {index + 1 + ". " + question.title}
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="question-list">
              <div className="question-list-header">
                <span>Title</span>
                <span></span>
                <span className="type">Type</span>
              </div>
              <div className="question-list-body">
                <DragDropContext onDragEnd={handleEditDragEnd}>
                  <Droppable droppableId="folders" type="droppableItem">
                    {(provided) => (
                      <div ref={provided.innerRef}>
                        {state.questions.map((folder: Folder, fIndex: number) =>
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
                                        <div className={`folder`}>
                                          <label
                                            htmlFor={"folder-" + fIndex}
                                            className="folder-item"
                                          >
                                            <input
                                              ref={(e: HTMLInputElement) =>
                                                (folderCheckboxRefs[fIndex] = e)
                                              }
                                              id={"folder-" + fIndex}
                                              type="checkbox"
                                              onClick={(e) =>
                                                selectQuestionsForPoll(
                                                  e,
                                                  true,
                                                  fIndex
                                                )
                                              }
                                            />
                                            <svg
                                              className="folder-icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="24"
                                              viewBox="0 -1 24 24"
                                              width="24"
                                            >
                                              <path d="M448.916,118.259h-162.05c-6.578,0-13.003-2.701-17.44-7.292l-50.563-53.264c-12.154-12.115-28.783-18.443-45.625-18.346    H63.084C28.301,39.356,0,67.657,0,102.439v307.123c0,34.783,28.301,63.084,63.084,63.084h386.064h0.058    c34.764-0.154,62.949-28.59,62.794-63.277V181.342C512,146.559,483.699,118.259,448.916,118.259z M473.417,409.447    c0.058,13.504-10.88,24.558-24.307,24.616H63.084c-13.504,0-24.5-10.996-24.5-24.5V102.439c0-13.504,10.996-24.5,24.5-24.52    H173.74c0.212,0,0.424,0,0.637,0c6.443,0,12.694,2.566,16.899,6.733l50.293,53.013c11.806,12.192,28.32,19.176,45.297,19.176    h162.05c13.504,0,24.5,10.996,24.5,24.5V409.447z" />
                                            </svg>
                                            <div>{folder.folder}</div>
                                          </label>
                                        </div>
                                        {folder.questions.map(
                                          (question, qIndex) => (
                                            <div key={fIndex + "-" + qIndex}>
                                              <Draggable
                                                draggableId={
                                                  fIndex + "-" + qIndex
                                                }
                                                index={qIndex}
                                              >
                                                {(provided) => (
                                                  <label
                                                    htmlFor={
                                                      fIndex + "-" + qIndex
                                                    }
                                                    key={fIndex + "-" + qIndex}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`preview-question ${
                                                      sessionQuestions[
                                                        fIndex
                                                      ] &&
                                                      sessionQuestions[
                                                        fIndex
                                                      ].includes(qIndex)
                                                        ? "selected"
                                                        : ""
                                                    }`}
                                                  >
                                                    <input
                                                      ref={(
                                                        e: HTMLInputElement
                                                      ) => {
                                                        // if folder doesn't exist, init it to an array
                                                        if (
                                                          !questionCheckboxRefs[
                                                            fIndex
                                                          ]
                                                        )
                                                          questionCheckboxRefs[
                                                            fIndex
                                                          ] = [];
                                                        questionCheckboxRefs[
                                                          fIndex
                                                        ][qIndex] = e;
                                                      }}
                                                      id={fIndex + "-" + qIndex}
                                                      type="checkbox"
                                                      defaultChecked={
                                                        sessionQuestions[
                                                          fIndex
                                                        ] &&
                                                        sessionQuestions[
                                                          fIndex
                                                        ].includes(qIndex)
                                                      }
                                                      onClick={(e) =>
                                                        selectQuestionsForPoll(
                                                          e,
                                                          false,
                                                          fIndex,
                                                          qIndex
                                                        )
                                                      }
                                                    />
                                                    <div className="title">
                                                      {question.title}
                                                    </div>
                                                    <div></div>
                                                    <div className="type">
                                                      {question.type}
                                                    </div>
                                                  </label>
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
                                        <label
                                          htmlFor={"rogue-" + qIndex}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`preview-question rogue-question ${
                                            sessionQuestions[fIndex] &&
                                            sessionQuestions[fIndex].includes(
                                              qIndex
                                            )
                                              ? "selected"
                                              : ""
                                          }`}
                                        >
                                          <input
                                            id={"rogue-" + qIndex}
                                            type="checkbox"
                                            ref={(e: HTMLInputElement) => {
                                              // if folder doesn't exist, init it to an array
                                              if (!questionCheckboxRefs[fIndex])
                                                questionCheckboxRefs[
                                                  fIndex
                                                ] = [];
                                              questionCheckboxRefs[fIndex][
                                                qIndex
                                              ] = e;
                                            }}
                                            defaultChecked={
                                              sessionQuestions[fIndex] &&
                                              sessionQuestions[fIndex].includes(
                                                qIndex
                                              )
                                            }
                                            onClick={(e) =>
                                              selectQuestionsForPoll(
                                                e,
                                                false,
                                                fIndex,
                                                qIndex
                                              )
                                            }
                                          />
                                          <div className="title">
                                            {question.title}
                                          </div>
                                          <div></div>
                                          <div className="type">
                                            {question.type}
                                          </div>
                                        </label>
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
          )}
        </div>
      </div>

      <div className="buttons">
        <button
          type="reset"
          className="cancel-button"
          onClick={closeQuestionSelect}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="save-button"
          onClick={presentQuestions}
        >
          <Link to="/poll/present">Present</Link>
        </button>
      </div>
    </div>
  );
};

export default QuestionSelect;
