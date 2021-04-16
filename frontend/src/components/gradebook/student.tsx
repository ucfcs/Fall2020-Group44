import React, { ReactElement } from "react";
import { StudentInfo } from "../../types";

interface Props {
  student: StudentInfo;
}

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student">
      <td>{student.name}</td>
      <td className="align-right">{student.total.toFixed(2)}</td>

      {student.sessions.map((session, sIndex) => (
        <td key={sIndex} className="align-right">
          {session.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

export default Student;
