import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import { RESPOND } from "../../constants";
import { store } from "../../store";

import "./session-header.scss";

const SessionHeader = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const clearSession = (): void => {
    dispatch({ type: "update-question-number", payload: 0 });
    dispatch({ type: "update-question-progress", payload: RESPOND });
  };

  return (
    <div className="session-header">
      <h1>
        <Link to="/">CAP1000</Link>
      </h1>
      <Link onClick={clearSession} className="exit-button" to="/">
        EXIT
      </Link>
    </div>
  );
};

export default SessionHeader;
