/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useReducer } from "react";

const closedQuestions = new Set();

const init = {
  previewFolder: 0,
  previewQuestion: 0,
  questions: [
    {
      folder: "Chapter 1",
      questions: [
        {
          title: "Photosynthesis 1a",
          question: "What are the products of photosynthesis?",
          type: "Mult Choice",
          choices: [
            "Carbon dioxide and water",
            "Glucose and oxygen",
            "Lactic acid",
          ],
          correct: 1,
        },
        {
          title: "Photosynthesis 1b",
          question: "What colour is chlorophyll?",
          type: "Mult Choice",
          choices: ["Black", "Blue", "Green"],
          correct: 2,
        },
      ],
    },
    {
      folder: "Chapter 2",
      questions: [
        {
          title: "Photosynthesis 2a",
          question: "Where does photosynthesis take place?",
          type: "Mult Choice",
          choices: [
            "In the chloroplasts",
            "In the cell wall",
            "In the nucleus",
          ],
          correct: 0,
        },
        {
          title: "Photosynthesis 2b",
          question: "What are the reactants of photosynthesis?",
          type: "Mult Choice",
          choices: [
            "Carbon dioxide and water",
            "Carbon dioxide and oxygen",
            "Glucose and oxygen",
          ],
          correct: 0,
        },
      ],
    },
    {
      folder: "Chapter 3",
      questions: [
        {
          title: "Photosynthesis 3a",
          question: "When do plants respire?",
          type: "Mult Choice",
          choices: [
            "During the day only",
            "During the day and night",
            "During the night only",
          ],
          correct: 1,
        },
        {
          title: "Photosynthesis 3b",
          question: "When do plants photosynthesise?",
          type: "Mult Choice",
          choices: [
            "During the day and night",
            "During the night only",
            "During the day only",
          ],
          correct: 2,
        },
      ],
    },
    {
      folder: "Chapter 4",
      questions: [
        {
          title: "Photosynthesis 4a",
          question: "What are the cells near the top of leaves called?",
          type: "Mult Choice",
          choices: ["Palisade cells", "Root hair cells", "Red blood cells"],
          correct: 0,
        },
        {
          title: "Photosynthesis 4b",
          question: "What does xylem carry?",
          type: "Mult Choice",
          choices: ["Water", "Blood", "Carbohydrates"],
          correct: 2,
        },
      ],
    },
    {
      folder: null,
      questions: [
        {
          title: "Photosynthesis 1",
          question: "What do stomata do?",
          type: "Mult Choice",
          choices: [
            "Stop carbon dioxide diffusing into leaves",
            "Allow oxygen to diffuse into leaves",
            "Allow carbon dioxide to diffuse into leaves",
          ],
          correct: 2,
        },
        {
          title: "Photosynthesis 2",
          question: "How are root hair cells adapted?",
          type: "Mult Choice",
          choices: [
            "Huge surface area",
            "Lots of chloroplasts",
            "Have no cell wall",
          ],
          correct: 1,
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
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
