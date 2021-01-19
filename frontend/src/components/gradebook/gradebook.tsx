import Student from "./student";
import { StudentInfo, Session } from "../../types";

const data = require("./mock-data.json");

const Gradebook = () => {
    const students = data.students;
    const overallSessions = data.overallSessions;

    return (
        <div className="gradebook">
            <label htmlFor="grade-search">Search for Student</label>

            <input id="grade-search" />

            <button>Export to Canvas</button>

            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Totals</th>
                        {overallSessions.map((session: Session) => (
                            <td>{session.name}</td>
                        ))}
                    </tr>
                    <tr>
                        <th>Class Average</th>
                        <th>Add average</th>
                        {overallSessions.map((session: Session) => (
                            <td>{session.average}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student: StudentInfo) => (
                        <Student
                            name={student.name}
                            total={student.total}
                            sessions={student.sessions}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Gradebook;
