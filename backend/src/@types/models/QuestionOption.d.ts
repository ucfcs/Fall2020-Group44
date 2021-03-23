type QuestionOptionId = number;

interface QuestionlOptionAttributes {
	id: QuestionOptionId;
	questionId: QuestionId;
	text: string;
	isAnswer: boolean;
}

interface QuestionOptionCreationAttributes {
	questionId: QuestionId;
	text: string;
	isAnswer: boolean;
}
