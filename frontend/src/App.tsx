import React from "react";
import Header from './components/header'
import Body from './components/home-page/body'
import Creator from './components/creator-module/creator'
// import "./App.scss";

function App() {
  return (
    <div className="App">
      <Header />
      <Body />
      <Creator />
    </div>
  );
}

export default App;
