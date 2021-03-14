type CourseId = string;

interface CourseAttributes {
	id: CourseId;
	name: string;
	userId: UserId;
	canvasCourseId: string;
}

interface CourseCreationAttributes {
	name: string;
	userId: UserId;
	canvasCourseId: string;
}
