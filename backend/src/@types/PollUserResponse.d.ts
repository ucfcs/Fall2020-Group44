type QuestionUserResponse = number;

interface QuestionUserResponseAttributes {
	id: QuestionUserResponse;
	collectionId: CollectionId;
	questionOptionId: QuestionOptionId;
}

interface QuestionUserResponseCreationAttributes {
	collectionId: CollectionId;
	questionOptionId: QuestionOptionId;
}
