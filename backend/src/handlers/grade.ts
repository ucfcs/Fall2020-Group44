import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import {
	Question,
	QuestionGrade,
	Session,
	SessionGrade,
	User,
} from '../models';
import responses from '../util/api/responses';
import { getStudents } from '../util/canvas';

const mockUserid = 1;

// GET /api/v1/cousrses/:courseId/grades
export const getSessionsGrades = async (
	event: APIGatewayEvent
): Promise<ProxyResult> => {
	const courseId = Number(event.pathParameters?.courseId);

	try {
		// Get all students belong to the current course from Canvas
		const canvasStudents: CanvasStudent[] = await getStudents(
			mockUserid,
			courseId
		);

		const studentIds = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				const user = await User.findOne({ where: { canvasId: student.id } });
				return user?.get().id;
			})
		);

		// Get all sessions belong to the current course
		const sessions = (
			await Session.findAll({
				where: {
					courseId: courseId,
				},
			})
		).map((session) => ({ id: session.get().id, name: session.get().name }));

		// Get individual grade for each session
		const studentGrades = await Promise.all(
			studentIds.map(async (studentId, index) => {
				const grades = await Promise.all(
					sessions.map(async (session) => {
						const grade = await SessionGrade.findOne({
							where: {
								userId: studentId,
								sessionId: session.id,
							},
						});

						return {
							points: grade?.get().points,
							maxPoints: grade?.get().maxPoints,
						};
					})
				);

				return {
					name: canvasStudents[index].name,
					grades: grades,
				};
			})
		);
		return responses.ok({
			students: studentGrades,
			sessions,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};
