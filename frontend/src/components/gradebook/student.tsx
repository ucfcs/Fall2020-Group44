import React, { ReactElement } from "react";
import { StudentInfo } from "../../types";

const Student = (props: StudentInfo): ReactElement => {
  return (
    <tr className="student">
      <td>{props.name}</td>

      <td className="align-right">{props.total.toFixed(2)}</td>

      {props.sessions.map((session, index) => (
        <td key={index} className="align-right">
          {session.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

export default Student;
