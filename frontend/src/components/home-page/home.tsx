import React, { ReactElement, useContext, useEffect } from "react";
import ContentTree from "./content-tree/content-tree";
import "./home.scss";
import HomeHeader from "../home-header/home-header";
import QuestionPreview from "./question-preview/question-preview";
import { getFolders } from "../../util/api";
import { store } from "../../store";
import { Folder, Question } from "../../types";

const Body = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const url = `${process.env.REACT_APP_REST_URL}/dev/api/v1/courses`;

  useEffect(() => {
    if (state.updateQuestions) {
      getFolders(url, state.courseId)
        .then((response) => {
          return response.json();
        })
        .then((json: ServerResponse) => {
          dispatch({
            type: "update-questions",
            payload: [
              ...json.folders,
              { name: null, Questions: json.questions },
            ],
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }

    dispatch({ type: "questions-updated" });
  }, [state.updateQuestions]);

  return (
    <>
      <HomeHeader />

      <div className="body">
        <ContentTree />

        {/* <div className="content-page">
          <QuestionPreview />
        </div> */}
      </div>
    </>
  );
};

interface ServerResponse {
  folders: Folder[];
  questions: Question[];
}

export default Body;
