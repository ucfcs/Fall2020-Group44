/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useReducer } from "react";

const baseQuestionInfo = {
  title: "",
  question: "",
  type: "Mult Choice",
  QuestionOptions: [
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
  createFolderIndex: -1,
  courseId: null,
  questions: [],
  sessionQuestions: [],
  editPreviewQuestion: false,
  openCreator: false,
  openFolderCreator: false,
  openQuestionSelect: false,
  questionNumber: 0,
  classSize: 0,
  openExportModal: false,
  currentQuestionInfo: JSON.parse(JSON.stringify(baseQuestionInfo)),
  websocket: null,
  jwt: null,
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
      case "update-creator-module-folder-index":
        return { ...state, createFolderIndex: action.payload };
      case "edit-preview-question":
        return { ...state, editPreviewQuestion: true };
      case "close-preview-question":
        return { ...state, editPreviewQuestion: false };
      case "update-session-questions":
        return { ...state, sessionQuestions: action.payload };
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
      case "update-question-number":
        return { ...state, questionNumber: action.payload };
      case "update-class-size":
        return { ...state, classSize: action.payload };
      case "open-export-modal":
        return { ...state, openExportModal: true };
      case "close-export-modal":
        return { ...state, openExportModal: false };
      case "reset-current-question-info":
        return {
          ...state,
          currentQuestionInfo: JSON.parse(JSON.stringify(baseQuestionInfo)),
        };
      case "set-current-question-info":
        return { ...state, currentQuestionInfo: action.payload };
      case "set-websocket":
        return { ...state, websocket: action.payload };
      case "clear-websocket":
        return { ...state, websocket: null };
      case "update-questions":
        return { ...state, questions: action.payload };
      case "set-course-id":
        return { ...state, courseId: action.payload };
      case "set-jwt":
        return { ...state, jwt: action.payload };
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
