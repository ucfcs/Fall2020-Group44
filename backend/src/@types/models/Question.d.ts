type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	folderId: FolderId;
	courseId: CourseId;
	title: string;
	question: string;
	participationPoints: number;
	correctnessPoints: number;
	type: string;
}

interface QuestionCreationAttributes {
	folderId: FolderId | null;
	courseId: CourseId;
	question: string;
	title: string;
	participationPoints: number;
	correctnessPoints: number;
	type: string;
	QuestionOptions: Array<QuestionOption>;
}
