type SessionId = number;

interface SessionAttributes {
	id: SessionId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	Questions?: Question[];
}

interface SessionCreationAttributes {
	name: string;
	userId: UserId;
	courseId: CourseId;
}
