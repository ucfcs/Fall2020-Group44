type FolderId = number;

interface FolderAttributes {
	id: FolderId;
	name: string;
	userId: UserId;
	courseId: string;
}

interface FolderCreationAttributes {
	name: string;
	userId: UserId;
	courseId: string;
}
