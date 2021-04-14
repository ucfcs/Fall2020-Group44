import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import {
	Question,
	QuestionGrade,
	Session,
	SessionGrade,
	User,
} from '../models';
import responses from '../util/api/responses';
import { createAssignment, getStudents, postGrades } from '../util/canvas';

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
				const user = await User.findOne({
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

				return {
					name: student.name,
					...user?.get(),
				};
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
				const user = await User.findOne({
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

				return {
					name: student.name,
					...user?.get(),
				};
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

export const exportGrades = async (
	event: APIGatewayEvent
): Promise<ProxyResult> => {
	const courseId = Number(event.pathParameters?.courseId);

	try {
		const body = JSON.parse(event.body || '{}');

		if (!body.name || !body.points || !body.sessionIds) {
			return responses.badRequest({
				message: 'Missing body parameters: name, points, sessionIds',
			});
		}

		const sessionIds = body.sessionIds;
		const assignmentName = body.name;
		const assignmentPoints = Number(body.points);

		const [assignmentId, canvasStudents] = await Promise.all([
			createAssignment(mockUserid, courseId, assignmentName, assignmentPoints), // Create a new assignment
			getStudents(mockUserid, courseId), // Get all students belong to the current course from Canvas
		]);

		// Calculate assignment points for each students
		const grades = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				let totalPoints = 0;
				let totalMaxPoints = 0;
				sessionIds.map(async (sessionId: number) => {
					const sessionGrade = await SessionGrade.findOne({
						where: {
							sessionId: sessionId,
							userId: student.id,
						},
					});

					totalPoints += Number(sessionGrade?.get().points);
					totalMaxPoints += Number(sessionGrade?.get().maxPoints);
				});

				return {
					id: student.id,
					points: (totalPoints / totalMaxPoints) * assignmentPoints,
				};
			})
		);

		await postGrades(mockUserid, courseId, assignmentId, grades);

		return responses.ok({
			message: 'success',
		});
	} catch (error) {
		console.log(error);
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};
