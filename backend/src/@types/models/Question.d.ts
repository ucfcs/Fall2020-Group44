type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	folderId: FolderId;
	title: string;
	question: string;
}

interface QuestionCreationAttributes {
	folderId: FolderId;
	question: string;
	title: string;
	QuestionOptions: Array<QuestionOption>;
}
