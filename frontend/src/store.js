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
          title: "What’s my middle name",
          question: "What’s my middle name",
          type: "Mult Choice",
          choices: ["Joe", "Mama", "xXxDarkRevenge69xXx"],
          correct: 0,
        },
        {
          title: "Where is the capital of Florida",
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
          title: "Where is the capital of Florida",
          question: "Where is the capital of Florida",
          type: "Mult Choice",
          choices: ["Washington DC", "Paris", "Egypt"],
          correct: 1,
        },
        {
          title: "Who was the first President",
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
  poll: 1,
  editPreviewQuestion: false,
  openCreator: false,
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
      default:
        throw new Error("Base reducer: this action type was not defined");
    }
  }, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
