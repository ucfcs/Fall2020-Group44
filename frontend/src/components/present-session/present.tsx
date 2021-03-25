import React, { useState, ReactElement, useContext } from "react";
import PresentPreview from "./present-preview/present-preview";
import PresentFooter from "./present-footer/present-footer";
import "./present.scss";
import PollHeader from "../session-header/session-header";
import { store } from "../../store";

const Present = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  if (state.websocket) {
    state.websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.action) {
        case "studentConnected":
          setStudentsConnected(studentsConnected + 1);
          break;
        case "studentDisconnected":
          setStudentsConnected(studentsConnected - 1);
          break;
        case "endSession":
          state.websocket.close();
          break;
      }
    };
  }

  const [studentsConnected, setStudentsConnected] = useState<number>(0);

  return (
    <div className="present">
      <div className="content">
        <PollHeader />

        <div className="centering">
          <PresentPreview studentsConnected={studentsConnected} />
        </div>
      </div>

      <PresentFooter />
    </div>
  );
};

export default Present;
