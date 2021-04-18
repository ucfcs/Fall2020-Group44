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
import { useHistory } from "react-router";
import { store } from "../../store";

import { createSession, catchError } from "../../util/api";
import { Folder, Question, QuestionOption } from "../../types";
import Modal from "../modal/modal";
import "./question-select-modal.scss";

const QuestionSelect = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  const [isPreview, setIsPreview] = useState(false);
  const history = useHistory();

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
  };

  const presentQuestions = () => {
    createSession(
      state.courseId,
      state.sessionQuestions.map((question: Question) => question.id),
      state.jwt
    )
      .then(async (res) => {
        dispatch({ type: "close-question-select" });

        const { data } = await res.json();

        if (state.websocket) {
          state.websocket.send(
            JSON.stringify({
              action: "startSession",
              courseId: state.courseId,
              sessionId: data.id,
              sessionName: data.name,
            })
          );
        }

        history.push("/poll/present");
      })
      .catch(catchError);
  };

  const handlePreviewDragEnd = (result: DropResult) => {
    if (result.destination) {
      const newQuestions: Question[] = state.sessionQuestions;
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
        if (questionCheckboxRefs[folder]) {
          questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
            checkbox.checked = true;

            if (checkbox.parentElement) {
              checkbox.parentElement.classList.add("selected");
            }
          });
        }

        // push entire folder to session
        sessionQuestions[folder] = [
          ...Array(state.questions[folder].Questions.length).keys(),
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

        if (questionCheckboxRefs[folder]) {
          questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
            if (!checkbox.checked) isAllChecked = false;
          });
        }

        // check the folder's checkbox if so
        if (isAllChecked && folderCheckboxRefs[folder]) {
          folderCheckboxRefs[folder].checked = true;
        }

        // push question and sort the question order within the folder
        if (!sessionQuestions[folder]) {
          sessionQuestions[folder] = [];
        }

        sessionQuestions[folder].push(question);
        sessionQuestions[folder].sort((a: number, b: number) => a - b);
      }
    }
    // if unchecking a checkbox
    else {
      // folder
      if (isFolder) {
        // uncheck all the questions in the folder
        if (questionCheckboxRefs[folder]) {
          questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
            checkbox.checked = false;
            if (checkbox.parentElement) {
              checkbox.parentElement.classList.remove("selected");
            }
          });
        }

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

    // Update the global state with the questions in sessionQuestions
    const newSession: Question[] = [];

    Object.keys(sessionQuestions).forEach((f: string) => {
      sessionQuestions[f].forEach((q: number) => {
        const question = state.questions[f].Questions[q];
        question.isClosed = false;
        question.responseCount = 0;
        question.progress = 0;
        question.QuestionOptions.forEach((qOption: QuestionOption) => {
          qOption.responseCount = 0;
        });
        newSession.push(question);
      });
    });

    dispatch({ type: "update-session-questions", payload: newSession });
  };

  return (
    <Modal>
      <div className="question-select-module">
        <div className="creator-header">
          <button
            type="reset"
            className="exit"
            tabIndex={0}
            onClick={closeQuestionSelect}
          >
            X
          </button>

          <span className="header-title">Select Questions to Present</span>

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
                        {state.sessionQuestions.map(
                          (question: Question, index: number) => (
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
                  <span className="title">Title</span>

                  <span />

                  <span className="type">Type</span>
                </div>

                <div className="question-list-body">
                  <div>
                    {state.questions.map((folder: Folder, fIndex: number) =>
                      folder.name !== null ? (
                        <div key={fIndex}>
                          <div key={fIndex}>
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
                                  tabIndex={0}
                                  onClick={(e) =>
                                    selectQuestionsForPoll(e, true, fIndex)
                                  }
                                />

                                <div />

                                <img
                                  src="/img/folder-icon.svg"
                                  alt=""
                                  className="folder-icon"
                                />

                                <div>{folder.name}</div>
                              </label>
                            </div>
                            {folder.Questions.map((question, qIndex) => (
                              <div key={fIndex + "-" + qIndex}>
                                <label
                                  htmlFor={fIndex + "-" + qIndex}
                                  key={fIndex + "-" + qIndex}
                                  className={`preview-question ${
                                    sessionQuestions[fIndex] &&
                                    sessionQuestions[fIndex].includes(qIndex)
                                      ? "selected"
                                      : ""
                                  }`}
                                >
                                  <input
                                    ref={(e: HTMLInputElement) => {
                                      // if folder doesn't exist, init it to an array
                                      if (!questionCheckboxRefs[fIndex])
                                        questionCheckboxRefs[fIndex] = [];
                                      questionCheckboxRefs[fIndex][qIndex] = e;
                                    }}
                                    id={fIndex + "-" + qIndex}
                                    type="checkbox"
                                    defaultChecked={
                                      sessionQuestions[fIndex] &&
                                      sessionQuestions[fIndex].includes(qIndex)
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

                                  <div className="title">{question.title}</div>

                                  <div />

                                  <div className="type">{question.type}</div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div key={fIndex}>
                          <div className="rogue-question-separator"></div>
                          {folder.Questions.map((question, qIndex) => (
                            <label
                              key={qIndex}
                              htmlFor={"rogue-" + qIndex}
                              className={`preview-question rogue-question ${
                                sessionQuestions[fIndex] &&
                                sessionQuestions[fIndex].includes(qIndex)
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
                                    questionCheckboxRefs[fIndex] = [];
                                  questionCheckboxRefs[fIndex][qIndex] = e;
                                }}
                                defaultChecked={
                                  sessionQuestions[fIndex] &&
                                  sessionQuestions[fIndex].includes(qIndex)
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

                              <div className="title">{question.title}</div>

                              <div />

                              <div className="type">{question.type}</div>
                            </label>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="buttons">
          <button
            type="reset"
            className="cancel-button"
            tabIndex={0}
            onClick={closeQuestionSelect}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
            tabIndex={0}
            onClick={presentQuestions}
            disabled={state.sessionQuestions.length == 0}
          >
            Present
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionSelect;
