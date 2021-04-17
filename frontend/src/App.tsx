import React, { ReactElement, useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { store } from "./store";

import Home from "./components/home-page/home";
import Gradebook from "./components/gradebook/gradebook";
import SessionInProgress from "./components/session-in-progress/session-in-progress";
import GradebookSession from "./components/session/session";
import Present from "./components/present-session/present";
import Creator from "./components/creator-modal/creator";
import QuestionSelect from "./components/question-select-modal/question-select-modal";
import ExportModal from "./components/export-modal/export-modal";
import FolderModal from "./components/folder-modal/folder-modal";
import LogIn from "./components/log-in/log-in";
import PrivateRoute from "./components/private-route/private-route";

function App(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;
  const dispatch = global.dispatch;

  useEffect(() => {
    //establish websocket connection
    const websocket: WebSocket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}`
    );

    //when established, join the room as the professor
    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          action: "professorJoinRoom",
          courseId: state.courseId,
        })
      );
    };

    //set the global websocket
    dispatch({ type: "set-websocket", payload: websocket });

    // if the professor closes the window, remove them from the room
    window.onbeforeunload = () => {
      websocket.send(
        JSON.stringify({
          action: "leaveRoom",
          courseId: state.courseId,
        })
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Switch>
        <PrivateRoute exact={true} path="/">
          <Home />
        </PrivateRoute>

        <Route path="/course/:courseId" component={LogIn} />

        <PrivateRoute path="/poll/present">
          <Present />
        </PrivateRoute>

        <PrivateRoute path="/poll/display">
          <SessionInProgress />
        </PrivateRoute>

        <PrivateRoute path="/gradebook/:id" component={GradebookSession} />

        <PrivateRoute path="/gradebook">
          <Gradebook />
        </PrivateRoute>
      </Switch>

      {state.openCreator ? <Creator /> : null}
      {state.openFolderCreator ? <FolderModal /> : null}
      {state.openQuestionSelect ? <QuestionSelect /> : null}
      {state.openExportModal ? <ExportModal /> : null}
    </Router>
  );
}

export default App;
