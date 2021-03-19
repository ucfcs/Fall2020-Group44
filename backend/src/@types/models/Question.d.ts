type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	folderId: FolderId;
	courseId: CourseId;
	title: string;
	question: string;
}

interface QuestionCreationAttributes {
	folderId: FolderId | null;
	courseId: CourseId;
	question: string;
	title: string;
	QuestionOptions: Array<QuestionOption>;
}
