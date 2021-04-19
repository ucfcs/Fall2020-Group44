export const SCOPES = [
	'url:POST|/api/v1/courses/:course_id/assignments',
	'url:GET|/api/v1/courses/:course_id/students',
	'url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/update_grades',
	'url:PUT|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id',
	'url:GET|/api/v1/users/:user_id/enrollments',
	'url:GET|/api/v1/users/:user_id/profile',
	'url:GET|/api/v1/users/:id',
];
