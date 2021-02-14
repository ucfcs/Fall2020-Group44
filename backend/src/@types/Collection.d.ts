type CollectionId = number;

interface CollectionAttributes {
	id: CollectionId;
	folderId: FolderId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	publishedAt: string;
}

interface CollectionCreationAttributes {
	folderId: FolderId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	publishedAt: string | null;
}
