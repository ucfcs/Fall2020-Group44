import React, { ReactElement, useState, useContext } from "react";
import { store } from "../../store";
import ContentTree from "./content-tree";
import QuestionPreview from "./question-preview";
import SelectedList from "./selected-list";
import "./home.scss";
import HomeHeader from "../home-header/home-header";

const Body = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  return (
    <>
      <HomeHeader />

      <div className="body">
        <ContentTree />
        <div className="content-page">
          <QuestionPreview />
        </div>
      </div>
    </>
  );
};

export default Body;
