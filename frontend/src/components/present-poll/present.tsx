import React, { ReactElement } from "react";
import PresentPreview from "./present-preview";
import PresentFooter from "./present-footer";
import "./present.scss";

const Present = (): ReactElement => {
  return (
    <div className="present">
      <PresentPreview />
      <PresentFooter />
    </div>
  );
};

export default Present;
