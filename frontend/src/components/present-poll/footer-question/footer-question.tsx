import React, { ReactElement } from "react";

import "./footer-question.scss";

const FooterQuestion = ({ question }: QuestionProps): ReactElement => {
  return (
    <div className="footer-question">
      <img src="/img/logo.svg" />
      <p>{question}</p>
      <button className="delete">X</button>
    </div>
  );
};

type QuestionProps = {
  question: string;
};

export default FooterQuestion;
