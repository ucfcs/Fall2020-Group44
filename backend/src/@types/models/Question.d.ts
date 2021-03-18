type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	folderId: FolderId;
	question: string;
}

interface QuestionCreationAttributes {
	folderId: FolderId;
	question: string;
	QuestionOptions: Array<QuestionOption>;
}
