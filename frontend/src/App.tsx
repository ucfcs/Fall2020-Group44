import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ModalContainer, ModalRoute } from "react-router-modal";

import Body from "./components/home-page/body";
import Creator from "./components/creator-module/creator";
import Gradebook from "./components/gradebook/gradebook";
import HomeHeader from "./components/home-header/home-header";
import PollHeader from "./components/poll-header/poll-header";
import PollInProgress from "./components/poll-in-progress/poll-in-progress";
import Present from "./components/present-poll/present";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/poll">
          <PollHeader />
        </Route>

        <Route path="/">
          <HomeHeader />
        </Route>
      </Switch>

      <Switch>
        <Route exact path="/">
          <Body />
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

      <ModalRoute component={Creator} path="/create" />

      <ModalContainer />
    </Router>
  );
}

export default App;
