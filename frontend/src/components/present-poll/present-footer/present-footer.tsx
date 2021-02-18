import React, { ReactElement } from "react";
import FooterQuestion from "../footer-question/footer-question";
import "./present-footer.scss";

const PresentFooter = (): ReactElement => {
  const questions = ["Q1", "Q2", "Q3"];

  return (
    <div className="present-footer">
      {questions.map((question, index) => (
        <FooterQuestion key={index} question={question} />
      ))}
    </div>
  );
};

export default PresentFooter;
