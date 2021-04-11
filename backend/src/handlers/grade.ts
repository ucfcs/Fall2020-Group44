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

		// Get grades for each student
		const students = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				return await User.findOne({
					attributes: ['canvasId'],
					where: { canvasId: student.id },
					include: {
						model: SessionGrade,
						attributes: ['id', 'points', 'maxPoints'],
						where: {
							courseId: courseId,
						},
					},
				});
			})
		);

		// Get all sessions belong to the current course
		const sessions = await Session.findAll({
			where: {
				courseId: courseId,
			},
			attributes: ['id', 'name'],
		});

		return responses.ok({
			students,
			sessions,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

// GET /api/v1/cousrses/:courseId/sessions/:sessionId/grades
export const getQuestionsGrades = async (
	event: APIGatewayEvent
): Promise<ProxyResult> => {
	const courseId = Number(event.pathParameters?.courseId);
	const sessionId = Number(event.pathParameters?.sessionId);
	const sessionGradeId = (
		await SessionGrade.findOne({
			where: { sessionId },
		})
	)?.get().id;

	try {
		// Get all students belong to the current course from Canvas
		const canvasStudents: CanvasStudent[] = await getStudents(
			mockUserid,
			courseId
		);

		// Get grades for each student
		const students = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				return await User.findOne({
					attributes: ['canvasId'],
					where: { canvasId: student.id },
					include: {
						model: QuestionGrade,
						attributes: ['id', 'points', 'maxPoints'],
						where: {
							sessionGradeId: sessionGradeId,
						},
					},
				});
			})
		);

		// Get all questions belong to the current session
		const session = await Session.findOne({
			where: {
				id: sessionId,
			},
			include: {
				model: Question,
				attributes: ['id', 'title'],
			},
		});
		if (!session) {
			return responses.notFound();
		}

		return responses.ok({
			students,
			questions: session.get().Questions,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};
