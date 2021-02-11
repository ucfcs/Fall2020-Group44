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

  const [selectedQuestion, setSelectedQuestion] = useState([
    state.previewFolder,
    state.previewQuestion,
  ]);
  const [questions, setQuestions] = useState(state.questions);

  useEffect(() => {
    setQuestions(state.questions);
  }, [state.questions]);

  const [folderCollapse, setFolderCollapse] = useState(
    new Array(questions.length).fill(false)
  );

  const questionCheckboxRefs: { [key: number]: HTMLInputElement[] } = {};
  const folderCheckboxRefs: HTMLInputElement[] = [];

  const sessionQuestions: { [key: string]: number[] } = {};

  const handleUpdatePreviewQuestion = (folder: number, question: number) => {
    setSelectedQuestion([folder, question]);
    dispatch({
      type: "update-preview-folder",
      payload: folder,
    });
    dispatch({
      type: "update-preview-question",
      payload: question,
    });
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
    if ((event.target as HTMLInputElement).checked) {
      if (isFolder) {
        // push entire folder to session
        sessionQuestions[folder] = [
          ...Array(state.questions[folder].questions.length).keys(),
        ];
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = true;
        });
      } else {
        if (!sessionQuestions[folder]) sessionQuestions[folder] = [];
        sessionQuestions[folder].push(question);
        sessionQuestions[folder].sort((a: number, b: number) => a - b);
      }
    } else {
      if (isFolder) {
        sessionQuestions[folder] = [];
        questionCheckboxRefs[folder].forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = false;
        });
      } else {
        sessionQuestions[folder] = sessionQuestions[folder].filter(
          (q: number) => {
            return q !== question;
          }
        );
        folderCheckboxRefs[folder].checked = false;
      }
    }

    const newPoll: PollQuestion[] = [];
    Object.keys(sessionQuestions).forEach((f: string) => {
      sessionQuestions[f].forEach((q: number) => {
        newPoll.push(state.questions[f].questions[q]);
      });
    });

    state.poll = newPoll;
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
          <span>Question Type</span>
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
              {!folderCollapse[fIndex] &&
                folder.questions.map((question, qIndex) => (
                  <div
                    key={fIndex + "-" + qIndex}
                    className={`preview-question ${
                      selectedQuestion[0] === fIndex &&
                      selectedQuestion[1] === qIndex
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleUpdatePreviewQuestion(fIndex, qIndex)}
                  >
                    <input
                      ref={(e: HTMLInputElement) => {
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
