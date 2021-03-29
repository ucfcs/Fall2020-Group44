type QuestionGradeId = number;

interface QuestionGradeAttributes {
	id: QuestionGradeId;
	userId: UserId;
	sessionId: SessionId;
	questionId: QuestionId;
	points: number;
	maxPoints: number;
}

interface QuestionGradeCreationAttributes {
	userId: UserId;
	sessionId: SessionId;
	questionId: QuestionId;
	points: number;
	maxPoints: number;
}
