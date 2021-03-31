import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { RESPOND, RESPONSES, CORRECT_RESPONSE } from "../../../constants";

import "./session-progress.scss";

import { store } from "../../../store";

function usePrevious(value: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const SessionProgress = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const questionProgress = state.questionProgress;
  const questionNumber = state.questionNumber;
  const prevQuestionNumber = usePrevious(questionNumber);
  const isClosed = state.sessionQuestions[questionNumber].isClosed;

  // response bar
  const [classSize, setClassSize] = useState<number>(state.classSize);
  const [responseCount, setResponseCount] = useState<number>(
    state.sessionQuestions[questionNumber].responseCount
  );

  // everytime the question changes, update the reponse count for the previous
  // question before getting the response count of the next question
  useEffect(() => {
    if (prevQuestionNumber !== undefined) {
      updateResponses(prevQuestionNumber, responseCount).then(() => {
        setResponseCount(state.sessionQuestions[questionNumber].responseCount);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber]);

  if (state.websocket) {
    state.websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.action) {
        case "studentSubmitted":
          if (!isClosed) {
            setResponseCount(responseCount + 1);
          }
          break;
        case "studentLeft":
          setClassSize(classSize - 1);
          break;
        case "studentJoined":
          setClassSize(classSize + 1);
          break;
      }
    };
  }

  // dispatch the updated response count for a question so
  // that it persists
  const updateResponses = async (questionNum: number, count: number) => {
    const newQuestions = state.sessionQuestions;
    newQuestions[questionNum].responseCount = count;
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  const updateProgress = (event: SyntheticEvent): void => {
    let progress: number;
    const target = event.target as HTMLInputElement;

    if (target.tagName === "SPAN") {
      const parent = target.parentElement as HTMLInputElement;
      progress = parseInt(parent.value);
    } else {
      progress = parseInt(target.value);
    }

    dispatch({
      type: "update-question-progress",
      payload: progress,
    });
  };

  // toggle Stop Responses
  const toggleClosed = (): void => {
    // send students start- or endQuestion ws message
    if (!isClosed) {
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "endQuestion",
            courseId: state.courseId,
          })
        );
      }
    } else {
      if (state.websocket) {
        state.websocket.send(
          JSON.stringify({
            action: "startQuestion",
            courseId: state.courseId,
            question: state.sessionQuestions[questionNumber],
          })
        );
      }
    }

    //  update the isClosed attribute of the current Question
    const newQuestions = state.sessionQuestions;
    newQuestions[questionNumber].isClosed = !isClosed;
    dispatch({ type: "update-session-questions", payload: newQuestions });
  };

  return (
    <div className="session-progress">
      <div className="progress-info">
        <div className="progress-control">
          <button
            value={RESPOND}
            className={`control-button ${
              questionProgress >= RESPOND ? "active" : ""
            }`}
            onClick={updateProgress}
          >
            <span className="order">1</span>Respond
          </button>

          <div
            className={questionProgress >= RESPONSES ? "active line" : "line"}
          />

          <button
            value={RESPONSES}
            className={`control-button ${
              questionProgress >= RESPONSES ? "active" : ""
            }`}
            onClick={updateProgress}
          >
            <span className="order">2</span>View Responses
          </button>

          <div
            className={
              questionProgress >= CORRECT_RESPONSE ? "active line" : "line"
            }
          />

          <button
            value={CORRECT_RESPONSE}
            className={`control-button ${
              questionProgress >= CORRECT_RESPONSE ? "active" : ""
            }`}
            onClick={updateProgress}
          >
            <span className="order">3</span>Correct Response
          </button>
        </div>

        <div className="progress-bar">
          <span>
            {responseCount} / {classSize} Responses
          </span>

          <progress max={classSize} value={responseCount}>
            {responseCount} / {classSize} Responses
          </progress>
        </div>
      </div>

      <button
        onClick={toggleClosed}
        className={`close-button ${isClosed ? "closed" : ""}`}
      >
        {isClosed ? (
          <img src="/img/lock.svg" alt="" />
        ) : (
          <img src="/img/unlock.svg" alt="" />
        )}
        {isClosed ? "Responses Stopped" : "Stop Responses"}
      </button>
    </div>
  );
};

export default SessionProgress;
