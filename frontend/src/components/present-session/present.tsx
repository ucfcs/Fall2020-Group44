import React, { ReactElement } from "react";
import PresentPreview from "./present-preview/present-preview";
import PresentFooter from "./present-footer/present-footer";
import "./present.scss";
import PollHeader from "../session-header/session-header";

const Present = (): ReactElement => {
  return (
    <div className="present">
      <div className="content">
        <PollHeader />

        <div className="centering">
          <PresentPreview />
        </div>
      </div>

      <PresentFooter />
    </div>
  );
};

export default Present;
