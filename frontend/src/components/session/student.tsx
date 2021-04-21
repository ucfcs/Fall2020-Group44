import React, { ReactElement } from "react";
import { Grade, StudentQuestionInfo, QuestionGradeInfo } from "../../types";

const Student = ({ student, questions }: Props): ReactElement => {
  return (
    <tr className="student table-body-text">
      <td>{student.name}</td>
      <td className="align-right table-body-text">
        {student.total.toFixed(2)}
      </td>

      {student.QuestionGrades
        ? student.QuestionGrades.map((sessionGrade: Grade, sIndex: number) => (
            <td key={sIndex} className="align-right table-body-text">
              {sessionGrade.points.toFixed(2)}
            </td>
          ))
        : questions.map((_, index) => (
            <td key={index} className="align-right table-body-text">
              -
            </td>
          ))}
    </tr>
  );
};

interface Props {
  student: StudentQuestionInfo;
  questions: QuestionGradeInfo[];
}

export default Student;
