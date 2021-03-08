import React, { ReactElement } from "react";
import { StudentInfo } from "../../types";

interface Props {
  student: StudentInfo;
  sessionExpanded: number;
}

const Student = ({ student, sessionExpanded }: Props): ReactElement => {
  return (
    <tr className="student">
      <td>{student.name}</td>

      {sessionExpanded !== -1 ? (
        student.questions[sessionExpanded].map((question, qIndex) => (
          <td
            key={sessionExpanded + "-" + qIndex}
            className="expanded align-right"
          >
            {question.toFixed(2)}
          </td>
        ))
      ) : (
        <>
          <td className="align-right">{student.total.toFixed(2)}</td>

          {student.sessions.map((session, sIndex) => (
            <td key={sIndex} className="align-right">
              {session.toFixed(2)}
            </td>
          ))}
        </>
      )}
    </tr>
  );
};

export default Student;
