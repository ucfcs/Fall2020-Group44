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
};

const init = {
  previewFolder: 0,
  previewQuestion: 0,
  courseId: 0,
  questions: [
    {
      folder: "Chapter 1",
      questions: [
        {
          id: 0,
          title: "Photosynthesis 1a",
          question: "What are the products of photosynthesis?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Carbon dioxide and water",
              isAnswer: false,
            },
            {
              text: "Glucose and oxygen",
              isAnswer: true,
            },
            {
              text: "Lactic acid",
              isAnswer: false,
            },
          ],
        },
        {
          id: 0,
          title: "Photosynthesis 1b",
          question: "What colour is chlorophyll?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Black",
              isAnswer: false,
            },
            {
              text: "Blue",
              isAnswer: false,
            },
            {
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
          id: 0,
          title: "Photosynthesis 2a",
          question: "Where does photosynthesis take place?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "In the chloroplasts",
              isAnswer: true,
            },
            {
              text: "In the cell wall",
              isAnswer: false,
            },
            {
              text: "In the nucleus",
              isAnswer: false,
            },
          ],
        },
        {
          id: 0,
          title: "Photosynthesis 2b",
          question: "What are the reactants of photosynthesis?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Carbon dioxide and water",
              isAnswer: true,
            },
            {
              text: "Carbon dioxide and oxygen",
              isAnswer: false,
            },
            {
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
          id: 0,
          title: "Photosynthesis 3a",
          question: "When do plants respire?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "During the day only",
              isAnswer: false,
            },
            {
              text: "During the day and night",
              isAnswer: true,
            },
            {
              text: "During the night only",
              isAnswer: false,
            },
          ],
        },
        {
          id: 0,
          title: "Photosynthesis 3b",
          question: "When do plants photosynthesise?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "During the day and night",
              isAnswer: false,
            },
            {
              text: "During the night only",
              isAnswer: false,
            },
            {
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
          id: 0,
          title: "Photosynthesis 4a",
          question: "What are the cells near the top of leaves called?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Palisade cells",
              isAnswer: true,
            },
            {
              text: "Root hair cells",
              isAnswer: false,
            },
            {
              text: "Red blood cells",
              isAnswer: false,
            },
          ],
        },
        {
          id: 0,
          title: "Photosynthesis 4b",
          question: "What does xylem carry?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Water",
              isAnswer: false,
            },
            {
              text: "Blood",
              isAnswer: false,
            },
            {
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
          id: 0,
          title: "Photosynthesis 1",
          question: "What do stomata do?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Stop carbon dioxide diffusing into leaves",
              isAnswer: false,
            },
            {
              text: "Allow oxygen to diffuse into leaves",
              isAnswer: false,
            },
            {
              text: "Allow carbon dioxide to diffuse into leaves",
              isAnswer: true,
            },
          ],
        },
        {
          id: 0,
          title: "Photosynthesis 2",
          question: "How are root hair cells adapted?",
          type: "Mult Choice",
          folderId: 0,
          questionOptions: [
            {
              text: "Huge surface area",
              isAnswer: false,
            },
            {
              text: "Lots of chloroplasts",
              isAnswer: true,
            },
            {
              text: "Have no cell wall",
              isAnswer: false,
            },
          ],
        },
      ],
    },
  ],
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
      case "update-questions":
        return { ...state, questions: action.payload };
      case "reset-current-question-info":
        return { ...state, currentQuestionInfo: baseQuestionInfo };
      case "set-current-question-info":
        return { ...state, currentQuestionInfo: action.payload };
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
