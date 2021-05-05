import React, { ReactElement } from "react";

import { Grade, StudentSessionInfo, BasicSessionInfo } from "../../types";

const Student = ({ student, sessions }: Props): ReactElement => {
  return (
    <tr className="student">
      <td className="first-column table-body-text">{student.name}</td>

      <td className="align-right table-body-text">
        {student.total.toFixed(2)}
      </td>

      {sessions.map((session: BasicSessionInfo, sIndex: number) => {
        let isEmpty = true;

        return (
          <td key={sIndex} className="align-right table-body-text">
            {
              // check if a student has a grade
              student.SessionGrades.map((grade: Grade) => {
                // if so, display the grade
                if (grade.sessionId === session.id) {
                  isEmpty = false;
                  return grade.points.toFixed(2);
                }
              })
            }
            {
              // if not, display a dash
              isEmpty && "-"
            }
          </td>
        );
      })}
    </tr>
  );
};

interface Props {
  student: StudentSessionInfo;
  sessions: BasicSessionInfo[];
}

export default Student;
