/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useReducer } from "react";

const init = {
  previewFolder: 0,
  previewQuestion: 0,
  questions: [
    {
      folder: "Chapter 1",
      questions: [
        {
          title: "Photosynthesis 1a",
          question: "What’s my middle name",
          type: "Mult Choice",
          choices: [
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
            "Joe",
            "Mama",
            "xXxDarkRevenge69xXx",
          ],
          correct: 0,
        },
        {
          title: "Photosynthesis 1b",
          question: "Where is the capital of Florida",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
      ],
    },
    {
      folder: "Chapter 2",
      questions: [
        {
          title: "Photosynthesis 2a",
          question: "Where is the capital of Florida",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
        {
          title: "Photosynthesis 2b",
          question: "Who was the first President",
          type: "Mult Choice",
          choices: [
            "Joe Mama",
            "Abraham Lincoln",
            "George Washington",
            "Thomas Jefferson",
          ],
          correct: 2,
        },
      ],
    },
    {
      folder: "Chapter 3",
      questions: [
        {
          title:
            "Who was the first president of the United States and also what would you do if you met him and also this is really long because i need this to get to three lines to test the ellipses?",
          question: "Im out of questions smh",
          type: "Mult Choice",
          choices: ["RIP", "LMAO", "BLOCC"],
          correct: 1,
        },
        {
          title:
            "Who was the first president of the United States and also what would you do if you met him and also this is really long because i need this to get to three lines to test the ellipses?",
          question:
            "Who was the first president of the United States and also what would you do if you met him and also this is really long because i need this to get to three lines to test the ellipses?",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
      ],
    },
    {
      folder: "Chapter 4",
      questions: [
        {
          title: "Photosynthesis 4a",
          question: "Where is the capital of Florida",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
        {
          title: "Photosynthesis 4b",
          question: "Who was the first President",
          type: "Mult Choice",
          choices: [
            "Joe Mama",
            "Abraham Lincoln",
            "George Washington",
            "Thomas Jefferson",
          ],
          correct: 2,
        },
      ],
    },
    {
      folder: null,
      questions: [
        {
          title: "Photosynthesis lmao1",
          question: "Where is the capital of Florida",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
        {
          title: "Photosynthesis lmao2",
          question: "Who was the first President",
          type: "Mult Choice",
          choices: [
            "Joe Mama",
            "Abraham Lincoln",
            "George Washington",
            "Thomas Jefferson",
          ],
          correct: 2,
        },
      ],
    },
  ],
  poll: [],
  editPreviewQuestion: false,
  openCreator: false,
  openQuestionSelect: false,
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
      case "open-question-select":
        return { ...state, openQuestionSelect: true };
      case "close-question-select":
        return { ...state, openQuestionSelect: false };
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
