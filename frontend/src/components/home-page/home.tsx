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

        <QuestionPreview />
      </div>
    </>
  );
};

export default Body;
