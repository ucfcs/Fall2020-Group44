import React, { ReactElement } from "react";
import { Grade, StudentQuestionInfo } from "../../types";

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student table-body-text">
      <td>{student.name}</td>
      <td className="align-right table-body-text">
        {student.total.toFixed(2)}
      </td>

      {student.QuestionGrades.map((sessionGrade: Grade, sIndex: number) => (
        <td key={sIndex} className="align-right table-body-text">
          {sessionGrade.points.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

interface Props {
  student: StudentQuestionInfo;
}

export default Student;
