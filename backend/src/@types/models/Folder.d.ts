type FolderId = number;

interface FolderAttributes {
	id: FolderId;
	name: string;
	userId: UserId;
	courseId: CourseId;
}

interface FolderCreationAttributes {
	name: string;
	userId: UserId;
	courseId: CourseId;
}
