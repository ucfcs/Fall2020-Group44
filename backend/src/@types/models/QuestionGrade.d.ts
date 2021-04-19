type QuestionGradeId = number;

interface QuestionGradeAttributes {
	id: QuestionGradeId;
	courseId: CourseId;
	userId: UserId;
	sessionGradeId: SessionGradeId;
	sessionId: SessionId;
	questionId: QuestionId;
	points: number;
	maxPoints: number;
}

interface QuestionGradeCreationAttributes {
	courseId: CourseId;
	userId: UserId;
	sessionGradeId: SessionGradeId;
	sessionId: SessionId;
	questionId: QuestionId;
	points: number;
	maxPoints: number;
}
