import React, { ReactElement, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { store } from "./store";

import Home from "./components/home-page/home";
import Gradebook from "./components/gradebook/gradebook";
import SessionInProgress from "./components/session-in-progress/session-in-progress";
import GradebookSession from "./components/gradebook/session";
import Present from "./components/present-poll/present";
import Creator from "./components/creator-module/creator";
import QuestionSelect from "./components/home-page/question-select/question-select";

function App(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

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
      {state.openQuestionSelect ? <QuestionSelect /> : null}
    </Router>
  );
}

export default App;
