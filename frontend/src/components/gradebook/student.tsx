import { Session } from "inspector";
import React, { ReactElement } from "react";
import { Grade, StudentSessionInfo, BasicSessionInfo } from "../../types";

const Student = ({ student, sessions }: Props): ReactElement => {
  return (
    <tr className="student">
      <td className="first-column table-body-text">{student.name}</td>
      <td className="align-right table-body-text">
        {student.total.toFixed(2)}
      </td>

      {sessions.map((session: BasicSessionInfo, sIndex: number) => (
        <td key={sIndex} className="align-right table-body-text">
          {student.SessionGrades.map((grade: Grade) => {
            return grade.sessionId === session.id
              ? grade.points.toFixed(2)
              : "-";
          })}
        </td>
      ))}
    </tr>
  );
};

interface Props {
  student: StudentSessionInfo;
  sessions: BasicSessionInfo[];
}

export default Student;
