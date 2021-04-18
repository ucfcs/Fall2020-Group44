type SessionId = number;

interface SessionAttributes {
	id: SessionId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	Questions?: Question[];
	public readonly SessionGrades?: SessionGrade[];
}

interface SessionCreationAttributes {
	name: string;
	userId: UserId;
	courseId: CourseId;
}
