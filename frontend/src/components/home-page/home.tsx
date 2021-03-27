import React, { ReactElement } from "react";
import ContentTree from "./content-tree/content-tree";
import "./home.scss";
import HomeHeader from "../home-header/home-header";
import QuestionPreview from "./question-preview/question-preview";

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
