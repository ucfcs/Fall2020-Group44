import React, { ReactElement, useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { store } from "./store";

import Home from "./components/home-page/home";
import Gradebook from "./components/gradebook/gradebook";
import SessionInProgress from "./components/session-in-progress/session-in-progress";
import GradebookSession from "./components/gradebook/session";
import Present from "./components/present-session/present";
import Creator from "./components/creator-modal/creator";
import QuestionSelect from "./components/question-select-modal/question-select-modal";
import ExportModal from "./components/export-modal/export-modal";
import FolderModal from "./components/folder-modal/folder-modal";

function App(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  useEffect(() => {
    const websocket: WebSocket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}`
    );

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          action: "professorJoinRoom",
          courseId: state.courseId,
        })
      );
    };

    dispatch({ type: "set-websocket", payload: websocket });

    window.onbeforeunload = () => {
      websocket.send(
        JSON.stringify({
          action: "leaveRoom",
          courseId: state.courseId,
        })
      );
    };
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/poll/present">
          <Present />
        </Route>

        <Route path="/poll/display">
          <SessionInProgress />
        </Route>

        <Route path="/gradebook/:id" component={GradebookSession} />

        <Route path="/gradebook">
          <Gradebook />
        </Route>
      </Switch>

      {state.openCreator ? <Creator /> : null}
      {state.openFolderCreator ? <FolderModal /> : null}
      {state.openQuestionSelect ? <QuestionSelect /> : null}
      {state.openExportModal ? <ExportModal /> : null}
    </Router>
  );
}

export default App;
