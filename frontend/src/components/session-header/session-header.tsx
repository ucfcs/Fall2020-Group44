import React, { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import { RESPOND } from "../../constants";
import { store } from "../../store";

import "./session-header.scss";

const SessionHeader = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const clearSession = (): void => {
    dispatch({ type: "update-question-number", payload: 0 });
    dispatch({ type: "update-question-progress", payload: RESPOND });
    dispatch({ type: "open-questions" });
  };

  return (
    <div className="session-header">
      <Link to="/">
        <img
          alt="UCF React Logo"
          src="/img/UCFReactLogoBlackBackground.png"
          onClick={clearSession}
        />
      </Link>
      <Link onClick={clearSession} className="exit-button" to="/">
        EXIT
      </Link>
    </div>
  );
};

export default SessionHeader;
