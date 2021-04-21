type SessionId = number;

interface SessionAttributes {
	id: SessionId;
	name: string;
	courseId: CourseId;
	Questions?: Question[];
	public readonly SessionGrades?: SessionGrade[];
}

interface SessionCreationAttributes {
	name: string;
	courseId: CourseId;
}
