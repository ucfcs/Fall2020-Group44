import React, { ReactElement } from "react";
import { SessionGrade, StudentInfo } from "../../types";

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student">
      <td>{student.name}</td>

      {student.SessionGrades.map(
        (sessionGrade: SessionGrade, sIndex: number) => (
          <td key={sIndex} className="align-right">
            {sessionGrade.points} / {sessionGrade.maxPoints}
          </td>
        )
      )}
    </tr>
  );
};

interface Props {
  student: StudentInfo;
}

export default Student;
