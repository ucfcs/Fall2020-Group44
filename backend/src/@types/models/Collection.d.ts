type CollectionId = number;

interface CollectionAttributes {
	id: CollectionId;
	name: string;
	userId: UserId;
	courseId: CourseId;
	questions: Array<Question>;
}

interface CollectionCreationAttributes {
	name: string;
	userId: UserId;
	courseId: CourseId;
	questions: Array<Question>;
}
