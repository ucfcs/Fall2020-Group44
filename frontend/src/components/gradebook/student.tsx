const Student = (props: Props) => {
  return (
    <tr className="student">
      <td>{props.name}</td>

      <td>{props.total}</td>

      {props.sessions.map(session => <td>{session}</td>)}
    </tr>
  );
};

interface Props {
  name: string,
  total: string,
  sessions: string[]
}

export default Student;
