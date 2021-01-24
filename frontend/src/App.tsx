import React from "react";
import Header from './components/header'
import Body from './components/home-page/body'
import Creator from './components/creator-module/creator'
import Present from './components/present-poll/present'
import PollInProgress from './components/poll-in-progress/poll-in-progress';

function App() {
  return (
    <div className="App">
      <PollInProgress />
    </div>
  );
}

export default App;
