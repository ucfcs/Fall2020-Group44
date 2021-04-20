import React, { ReactElement } from "react";
import { Grade, StudentSessionInfo } from "../../types";

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student">
      <td className="first-column table-body-text">{student.name}</td>
      <td className="align-right table-body-text">
        {student.total.toFixed(2)}
      </td>

      {student.SessionGrades.map((sessionGrade: Grade, sIndex: number) => (
        <td key={sIndex} className="align-right table-body-text">
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
