import { StudentInfo } from "../../types";

const Student = (props: StudentInfo) => {
  return (
    <tr className="student">
      <td>{props.name}</td>

      <td className="align-right">{props.total.toFixed(2)}</td>

      {props.sessions.map(session => <td className="align-right">{session.toFixed(2)}</td>)}
    </tr>
  );
};

export default Student;
