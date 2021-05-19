import React, { ReactElement, useContext, useEffect, useState } from "react";

import { catchError, getFolders } from "../../util/api";
import { store } from "../../store";
import { FolderAndQuestionResponse } from "../../types";

import ContentTree from "./content-tree/content-tree";
import HomeHeader from "../home-header/home-header";
import QuestionPreview from "./question-preview/question-preview";

import "./home.scss";

const Body = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad) {
      getFolders(state.courseId, state.jwt)
        .then((response) => {
          return response.json();
        })
        .then((json: FolderAndQuestionResponse) => {
          dispatch({
            type: "update-questions",
            payload: [
              ...json.folders,
              { name: null, Questions: json.questions },
            ],
          });
          setFirstLoad(false);
        })
        .catch(catchError);
    }
  }, [dispatch, firstLoad, state.courseId, state.jwt, state.updateQuestions]);

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
