import React, { ReactElement } from "react";
import { Grade, StudentQuestionInfo } from "../../types";

const Student = ({ student }: Props): ReactElement => {
  return (
    <tr className="student">
      <td>{student.name}</td>

      {student.QuestionGrades.map((sessionGrade: Grade, sIndex: number) => (
        <td key={sIndex} className="align-right">
          {sessionGrade.points} / {sessionGrade.maxPoints}
        </td>
      ))}
    </tr>
  );
};

interface Props {
  student: StudentQuestionInfo;
}

export default Student;
