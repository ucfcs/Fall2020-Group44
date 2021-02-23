import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./poll-header.scss";

const PollHeader = (): ReactElement => {
  return (
    <div className="poll-header">
      <h1>
        <Link to="/">CAP1000</Link>
      </h1>
      <button className="exit-button">
        <Link to="/">EXIT</Link>
      </button>
    </div>
  );
};

export default PollHeader;
