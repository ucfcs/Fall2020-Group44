import React, { ReactElement } from "react";
import { StudentInfo } from "../../types";

const Student = (props: StudentInfo): ReactElement => {
  return (
    <tr className="student">
      <td>{props.name}</td>

      <td>{props.total}</td>

      {props.sessions.map((session, index: number) => (
        <td key={index}>{session}</td>
      ))}
    </tr>
  );
};

export default Student;
