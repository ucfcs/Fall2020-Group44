type QuestionUserResponse = number;

interface QuestionUserResponseAttributes {
	id: QuestionUserResponse;
	questionId: QuestionId;
	questionOptionId: QuestionOptionId;
	userId: UserId;
	collectionId: SessionId;
}

interface QuestionUserResponseCreationAttributes {
	questionId: QuestionId;
	questionOptionId: QuestionOptionId;
	userId: UserId;
	collectionId: SessionId;
}
