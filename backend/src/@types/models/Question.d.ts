type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	folderId: FolderId;
	question: string;
	timeToAnswer: string;
}

interface QuestionCreationAttributes {
	folderId: FolderId;
	question: string;
	timeToAnswer: string | null;
	QuestionOptions: Array<QuestionOption>;
}
