type QuestionOptionId = number;

interface QuestionlOptionAttributes {
	id: QuestionOptionId;
	questionId: CollectionId;
	text: string;
	isAnswer: boolean;
}

interface QuestionOptionCreationAttributes {
	questionId: CollectionId;
	text: string;
	isAnswer: boolean;
}
