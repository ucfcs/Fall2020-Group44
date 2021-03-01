import React, { ReactElement, useState, useContext } from "react";
import { Link } from "react-router-dom";
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

  const toggleEditQuestion = () => {
    dispatch({ type: "edit-preview-question" });
    dispatch({ type: "open-creator" });
  };

  const deleteQuestion = () => {
    console.log("deleteQuestion");
  };

  return (
    <>
      <HomeHeader />

      <div className="body">
        <ContentTree />
        <div className="content-page">
          <div className="tab-header">
            <button
              className={state.isPreviewTab ? "active" : ""}
              onClick={() => dispatch({ type: "open-preview-tab" })}
            >
              Question Preview
            </button>
            <button
              className={state.isPreviewTab ? "" : "active"}
              onClick={() => dispatch({ type: "close-preview-tab" })}
            >
              Selected List
            </button>
          </div>
          {state.isPreviewTab ? <QuestionPreview /> : <SelectedList />}
          <div className="option-buttons">
            <button className="present-button">
              <Link to="/poll/present">&#9658; Present</Link>
            </button>
            <button className="edit-button" onClick={toggleEditQuestion}>
              Edit
            </button>
            <button className="delete-button" onClick={deleteQuestion}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
