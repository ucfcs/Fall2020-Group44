import { StudentInfo } from "../../types";

const Student = (props: StudentInfo) => {
  return (
    <tr className="student">
      <td>{props.name}</td>

      <td>{props.total}</td>

      {props.sessions.map(session => <td>{session}</td>)}
    </tr>
  );
};

export default Student;
