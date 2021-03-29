type SessionGradeId = number;

interface SessionGradeAttributes {
	id: SessionGradeId;
	userId: UserId;
	sessionId: SessionId;
	points: number;
	maxPoints: number;
}

interface SessionGradeCreationAttributes {
	userId: UserId;
	sessionId: SessionId;
	points: number;
	maxPoints: number;
}
