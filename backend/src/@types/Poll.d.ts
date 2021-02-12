type PollId = number;

interface PollAttributes {
	id: PollId;
	folderId: FolderId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	publishedAt: string;
}

interface PollCreationAttributes {
	folderId: FolderId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	publishedAt: string;
}
