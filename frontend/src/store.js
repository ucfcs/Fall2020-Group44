/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useReducer } from "react";

const closedQuestions = new Set();

const baseQuestionInfo = {
  title: "",
  question: "",
  type: "Mult Choice",
  questionOptions: [
    { text: "", isAnswer: false },
    { text: "", isAnswer: false },
  ],
  folderId: null,
  participationPoints: 0.5,
  correctnessPoints: 0.5,
};

const init = {
  previewFolder: 0,
  previewQuestion: 0,
  courseId: "0",
  questions: [],
  updateQuestions: true,
  poll: [],
  editPreviewQuestion: false,
  openCreator: false,
  openFolderCreator: false,
  openQuestionSelect: false,
  questionProgress: 0,
  questionNumber: 0,
  closedQuestions: closedQuestions,
  openExportModal: false,
  currentQuestionInfo: baseQuestionInfo,
  websocket: null,
};
const store = React.createContext(init);
const { Provider } = store;

// eslint-disable-next-line react/prop-types
const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update-preview-folder":
        return { ...state, previewFolder: action.payload };
      case "update-preview-question":
        return { ...state, previewQuestion: action.payload };
      case "edit-preview-question":
        return { ...state, editPreviewQuestion: true };
      case "close-preview-question":
        return { ...state, editPreviewQuestion: false };
      case "update-session-questions":
        return { ...state, poll: action.payload };
      case "open-creator":
        return { ...state, openCreator: true };
      case "close-creator":
        return { ...state, openCreator: false };
      case "open-folder":
        return { ...state, openFolderCreator: true };
      case "close-folder":
        return { ...state, openFolderCreator: false };
      case "open-question-select":
        return { ...state, openQuestionSelect: true };
      case "close-question-select":
        return { ...state, openQuestionSelect: false };
      case "update-question-progress":
        return { ...state, questionProgress: action.payload };
      case "update-question-number":
        return { ...state, questionNumber: action.payload };
      case "close-question":
        return {
          ...state,
          closedQuestions: new Set([...state.closedQuestions, action.payload]),
        };
      case "open-questions":
        return { ...state, closedQuestions: new Set([]) };
      case "open-export-modal":
        return { ...state, openExportModal: true };
      case "close-export-modal":
        return { ...state, openExportModal: false };
      case "reset-current-question-info":
        return { ...state, currentQuestionInfo: baseQuestionInfo };
      case "set-current-question-info":
        return { ...state, currentQuestionInfo: action.payload };
      case "set-websocket":
        return { ...state, websocket: action.payload };
      case "clear-websocket":
        return { ...state, websocket: null };
      case "update-questions":
        return { ...state, questions: action.payload };
      case "questions-need-update":
        return { ...state, updateQuestions: true };
      case "questions-updated":
        return { ...state, updateQuestions: false };
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
