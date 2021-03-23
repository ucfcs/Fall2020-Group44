type SessionId = number;

interface SessionAttributes {
	id: SessionId;
	name: string;
	userId: UserId;
	courseId: CourseId;
}

interface SessionCreationAttributes {
	name: string;
	userId: UserId;
	courseId: CourseId;
}
