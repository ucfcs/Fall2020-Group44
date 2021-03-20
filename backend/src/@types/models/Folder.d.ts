type FolderId = number;

interface FolderAttributes {
	id: FolderId;
	name: string;
	courseId: CourseId;
}

interface FolderCreationAttributes {
	name: string;
	courseId: CourseId;
}
