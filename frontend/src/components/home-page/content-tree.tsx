import React, {
  useState,
  useEffect,
  useContext,
  ReactElement,
  SyntheticEvent,
} from "react";
import { store } from "../../store";
import "./content-tree.scss";

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

const ContentTree = (): ReactElement => {
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
    dispatch({ type: "open-preview-tab" });
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
        });
        // push entire folder to session
        sessionQuestions[folder] = [
          ...Array(state.questions[folder].questions.length).keys(),
        ];
      }
      // if it's a single question
      else {
        // see if all the questions in the folder are checked.
        let isAllChecked = true;
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          if (!checkbox.checked) isAllChecked = false;
        });
        // check the folder's checkbox if so
        if (isAllChecked) {
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
        });
        // delete all the questions in the folder from the session
        sessionQuestions[folder] = [];
      }
      // question
      else {
        // uncheck the question
        folderCheckboxRefs[folder].checked = false;
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
    dispatch({ type: "close-preview-tab" });
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
      <div className="question-list">
        <div className="question-list-header">
          <span>Title</span>
          <span></span>
          <span>Type</span>
        </div>
        <div className="question-list-body">
          {questions.map((folder: Folder, fIndex: number) => (
            <div key={fIndex}>
              <div
                className={`folder ${
                  folderCollapse[fIndex] ? "collapsed" : ""
                }`}
                onClick={() => handleFolderCollapse(fIndex)}
              >
                <input
                  ref={(e: HTMLInputElement) =>
                    (folderCheckboxRefs[fIndex] = e)
                  }
                  type="checkbox"
                  onClick={(e) => selectQuestionsForPoll(e, true, fIndex)}
                />
                {folder.folder}
              </div>
              {folder.questions.map((question, qIndex) => (
                <div
                  key={fIndex + "-" + qIndex}
                  className={`preview-question ${
                    selectedPreviewQuestion[0] === fIndex &&
                    selectedPreviewQuestion[1] === qIndex
                      ? "selected"
                      : ""
                  } ${folderCollapse[fIndex] ? "collapsed-item" : ""}`}
                  onClick={() => handleUpdatePreviewQuestion(fIndex, qIndex)}
                >
                  <input
                    ref={(e: HTMLInputElement) => {
                      // if folder doesn't exist, init it to an array
                      if (!questionCheckboxRefs[fIndex])
                        questionCheckboxRefs[fIndex] = [];
                      questionCheckboxRefs[fIndex][qIndex] = e;
                    }}
                    type="checkbox"
                    onClick={(e) =>
                      selectQuestionsForPoll(e, false, fIndex, qIndex)
                    }
                  />
                  <div className="title">{question.title}</div>
                  <div></div>
                  <div className="type">{question.type}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentTree;
