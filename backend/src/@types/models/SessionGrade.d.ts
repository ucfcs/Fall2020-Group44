type SessionGradeId = number;

interface SessionGradeAttributes {
	id: SessionGradeId;
	courseId: CourseId;
	userId: UserId;
	sessionId: SessionId;
	QuestionGrades: QuestionGrade[];
	points: number;
	maxPoints: number;
}

interface SessionGradeCreationAttributes {
	courseId: CourseId;
	userId: UserId;
	sessionId: SessionId;
	QuestionGrades: QuestionGrade[];
	points: number;
	maxPoints: number;
}
