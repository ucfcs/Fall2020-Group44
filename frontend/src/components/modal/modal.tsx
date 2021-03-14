import React, { ReactElement } from "react";

import "./modal.scss";

const Modal = (props: Props): ReactElement => {
  return <div className="modal">{props.children}</div>;
};

interface Props {
  children?: ReactElement | ReactElement[];
}

export default Modal;
