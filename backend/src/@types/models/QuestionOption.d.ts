type QuestionOptionId = number;

interface QuestionlOptionAttributes {
	id: QuestionOptionId;
	questionId: QuestionId;
	text: string;
	isAnswer: boolean;
}

interface QuestionOptionCreationAttributes {
	id?: QuestionOptionId;
	questionId: QuestionId;
	text: string;
	isAnswer: boolean;
}
