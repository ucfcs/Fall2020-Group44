import React, { ReactElement } from "react";
import { Grade, StudentSessionInfo } from "../../types";

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student">
      <td>{student.name}</td>
      <td className="align-right">{student.total.toFixed(2)}</td>

      {student.SessionGrades.map((sessionGrade: Grade, sIndex: number) => (
        <td key={sIndex} className="align-right">
          {sessionGrade.points.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

interface Props {
  student: StudentSessionInfo;
}

export default Student;
