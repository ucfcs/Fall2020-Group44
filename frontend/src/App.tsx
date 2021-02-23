import React, { ReactElement, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { store } from "./store";

import Home from "./components/home-page/home";
import Gradebook from "./components/gradebook/gradebook";
import PollInProgress from "./components/poll-in-progress/poll-in-progress";
import Present from "./components/present-poll/present";
import Creator from "./components/creator-module/creator";

function App(): ReactElement {
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
          <PollInProgress />
        </Route>

        <Route path="/gradebook">
          <Gradebook />
        </Route>
      </Switch>

      {state.openCreator ? <Creator /> : null}
    </Router>
  );
}

export default App;
