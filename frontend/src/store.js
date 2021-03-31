/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useReducer } from "react";

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
  questions: [
    {
      folder: "Chapter 1",
      questions: [
        {
          id: 1,
          title: "Photosynthesis 1a",
          question: "What are the products of photosynthesis?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 0,
              questionId: 1,
              text: "Carbon dioxide and water",
              isAnswer: false,
            },
            {
              id: 1,
              questionId: 1,
              text: "Glucose and oxygen",
              isAnswer: true,
            },
            {
              id: 2,
              questionId: 1,
              text: "Lactic acid",
              isAnswer: false,
            },
          ],
        },
        {
          id: 2,
          title: "Photosynthesis 1b",
          question: "What colour is chlorophyll?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 3,
              questionId: 2,
              text: "Black",
              isAnswer: false,
            },
            {
              id: 4,
              questionId: 2,
              text: "Blue",
              isAnswer: false,
            },
            {
              id: 5,
              questionId: 2,
              text: "Green",
              isAnswer: true,
            },
          ],
        },
      ],
    },
    {
      folder: "Chapter 2",
      questions: [
        {
          id: 3,
          title: "Photosynthesis 2a",
          question: "Where does photosynthesis take place?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 6,
              questionId: 3,
              text: "In the chloroplasts",
              isAnswer: true,
            },
            {
              id: 7,
              questionId: 3,
              text: "In the cell wall",
              isAnswer: false,
            },
            {
              id: 8,
              questionId: 3,
              text: "In the nucleus",
              isAnswer: false,
            },
          ],
        },
        {
          id: 4,
          title: "Photosynthesis 2b",
          question: "What are the reactants of photosynthesis?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 9,
              questionId: 4,
              text: "Carbon dioxide and water",
              isAnswer: true,
            },
            {
              id: 10,
              questionId: 4,
              text: "Carbon dioxide and oxygen",
              isAnswer: false,
            },
            {
              id: 11,
              questionId: 4,
              text: "Glucose and oxygen",
              isAnswer: false,
            },
          ],
        },
      ],
    },
    {
      folder: "Chapter 3",
      questions: [
        {
          id: 5,
          title: "Photosynthesis 3a",
          question: "When do plants respire?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 12,
              questionId: 5,
              text: "During the day only",
              isAnswer: false,
            },
            {
              id: 13,
              questionId: 5,
              text: "During the day and night",
              isAnswer: true,
            },
            {
              id: 14,
              questionId: 5,
              text: "During the night only",
              isAnswer: false,
            },
          ],
        },
        {
          id: 6,
          title: "Photosynthesis 3b",
          question: "When do plants photosynthesise?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 15,
              questionId: 6,
              text: "During the day and night",
              isAnswer: false,
            },
            {
              id: 16,
              questionId: 6,
              text: "During the night only",
              isAnswer: false,
            },
            {
              id: 17,
              questionId: 6,
              text: "During the day only",
              isAnswer: true,
            },
          ],
        },
      ],
    },
    {
      folder: "Chapter 4",
      questions: [
        {
          id: 7,
          title: "Photosynthesis 4a",
          question: "What are the cells near the top of leaves called?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 18,
              questionId: 7,
              text: "Palisade cells",
              isAnswer: true,
            },
            {
              id: 19,
              questionId: 7,
              text: "Root hair cells",
              isAnswer: false,
            },
            {
              id: 20,
              questionId: 7,
              text: "Red blood cells",
              isAnswer: false,
            },
          ],
        },
        {
          id: 8,
          title: "Photosynthesis 4b",
          question: "What does xylem carry?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 21,
              questionId: 8,
              text: "Water",
              isAnswer: false,
            },
            {
              id: 22,
              questionId: 8,
              text: "Blood",
              isAnswer: false,
            },
            {
              id: 23,
              questionId: 8,
              text: "Carbohydrates",
              isAnswer: true,
            },
          ],
        },
      ],
    },
    {
      folder: null,
      questions: [
        {
          id: 9,
          title: "Photosynthesis 1",
          question: "What do stomata do?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 24,
              questionId: 9,
              text: "Stop carbon dioxide diffusing into leaves",
              isAnswer: false,
            },
            {
              id: 25,
              questionId: 9,
              text: "Allow oxygen to diffuse into leaves",
              isAnswer: false,
            },
            {
              id: 26,
              questionId: 9,
              text: "Allow carbon dioxide to diffuse into leaves",
              isAnswer: true,
            },
          ],
        },
        {
          id: 10,
          title: "Photosynthesis 2",
          question: "How are root hair cells adapted?",
          type: "Mult Choice",
          folderId: 0,
          participationPoints: 0.5,
          correctnessPoints: 0.5,
          questionOptions: [
            {
              id: 27,
              questionId: 10,
              text: "Huge surface area",
              isAnswer: false,
            },
            {
              id: 28,
              questionId: 10,
              text: "Lots of chloroplasts",
              isAnswer: true,
            },
            {
              id: 29,
              questionId: 10,
              text: "Have no cell wall",
              isAnswer: false,
            },
          ],
        },
      ],
    },
  ],
  sessionQuestions: [],
  editPreviewQuestion: false,
  openCreator: false,
  openFolderCreator: false,
  openQuestionSelect: false,
  questionProgress: 0,
  questionNumber: 0,
  classSize: 0,
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
      case "update-question-progress":
        return { ...state, questionProgress: action.payload };
      case "update-question-number":
        return { ...state, questionNumber: action.payload };
      case "update-class-size":
        return { ...state, classSize: action.payload };
      case "open-export-modal":
        return { ...state, openExportModal: true };
      case "close-export-modal":
        return { ...state, openExportModal: false };
      case "update-questions":
        return { ...state, questions: action.payload };
      case "reset-current-question-info":
        return { ...state, currentQuestionInfo: baseQuestionInfo };
      case "set-current-question-info":
        return { ...state, currentQuestionInfo: action.payload };
      case "set-websocket":
        return { ...state, websocket: action.payload };
      case "clear-websocket":
        return { ...state, websocket: null };
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
