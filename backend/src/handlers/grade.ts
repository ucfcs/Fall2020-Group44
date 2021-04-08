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

		const studentIds: number[] = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				const user = await User.findOne({ where: { canvasId: student.id } });
				return Number(user?.get().id);
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
			studentIds.map(async (studentId: number, index: number) => {
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

// GET /api/v1/cousrses/:courseId/sessions/:sessionId/grades
export const getQuestionsGrades = async (
	event: APIGatewayEvent
): Promise<ProxyResult> => {
	const courseId = Number(event.pathParameters?.courseId);
	const sessionId = Number(event.pathParameters?.sessionId);

	try {
		// Get all students belong to the current course from Canvas
		const canvasStudents: CanvasStudent[] = await getStudents(
			mockUserid,
			courseId
		);
		const studentIds: number[] = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				const user = await User.findOne({ where: { canvasId: student.id } });

				return Number(user?.get().id);
			})
		);

		// Get all questions belong to the current session
		const session = await Session.findOne({
			where: {
				id: sessionId,
			},
			include: {
				model: Question,
			},
		});
		if (!session) {
			return responses.notFound();
		}
		const questions = session.get().Questions?.map((question) => ({
			id: question.get().id,
			title: question.get().title,
		}));

		// Get individual grade for each question
		const studentsGrades = await Promise.all(
			studentIds.map(async (studentId: number, index: number) => {
				const grades = await Promise.all(
					(questions || []).map(async (question) => {
						const questionGrade = await QuestionGrade.findOne({
							where: {
								userId: studentId,
								questionId: question.id,
							},
						});

						return {
							points: questionGrade?.get().points,
							maxPoints: questionGrade?.get().maxPoints,
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
			questions,
			students: studentsGrades,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};
