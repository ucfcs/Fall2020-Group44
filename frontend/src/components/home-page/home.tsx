import React, { ReactElement } from "react";
import ContentTree from "./content-tree";
import QuestionPreview from "./question-preview";
import "./home.scss";
import HomeHeader from "../home-header/home-header";

const Body = (): ReactElement => {
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
