import {
	APIGatewayProxyHandler,
	APIGatewayEvent,
	ProxyResult,
	APIGatewayEventDefaultAuthorizerContext,
} from 'aws-lambda';
import {
	Question,
	QuestionGrade,
	Session,
	SessionGrade,
	User,
} from '../models';
import responses from '../util/api/responses';
import { createAssignment, getStudents, postGrades } from '../util/canvas';
import { calculate } from './sessionGrades';
import { Sequelize } from 'sequelize';


// GET /api/v1/courses/:courseId/grades
export const getSessionsGrades = async (
	event: APIGatewayEvent
): Promise<ProxyResult> => {

	const currentUser: APIGatewayEventDefaultAuthorizerContext = event.requestContext.authorizer || {};
	const courseId = event.pathParameters?.courseId;

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	try {
		// Get all sessions belong to the current course
		const sessions = await Session.findAll({
			where: {
				courseId: courseId,
			},
			attributes: ['id', 'name'],
			include: {
				model: SessionGrade,
				attributes: [
					[Sequelize.fn('avg', Sequelize.col('points')), 'avgPoints'],
					'maxPoints',
				],
				required: true,
			},
			group: ['sessionId'],
		});

		let classMax = 0;
		sessions.forEach((session) => {
			session
				.get()
				.SessionGrades?.forEach((grade) => (classMax += grade.get().maxPoints));
		});

		// Get all students belong to the current course from Canvas
		const canvasStudents: CanvasStudent[] = await getStudents(
			currentUser.canvasId,
			courseId
		);

		let classTotal = 0;

		// Get grades for each student
		const students = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				const user = await User.findOne({
					attributes: ['canvasId'],
					where: { canvasId: student.id },
					include: [
						{
							model: SessionGrade,
							attributes: ['id', 'sessionId', 'points', 'maxPoints'],
							where: {
								courseId: courseId,
							},
							// required: true,
						},
					],
				});

				let studentTotal = 0;

				//calculate the user's total
				user?.get().SessionGrades?.forEach((grade) => {
					studentTotal += grade.points;
				});

				//add to running class total
				classTotal += studentTotal;

				return {
					name: student.name,
					total: studentTotal,
					...user?.get(),
				};
			})
		);

		const classAverage = classTotal / canvasStudents.length;

		return responses.ok({
			classAverage: { points: classAverage, maxPoints: classMax },
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
	const currentUser: APIGatewayEventDefaultAuthorizerContext= event.requestContext.authorizer || {};
	const courseId = event.pathParameters?.courseId;
	const sessionId = Number(event.pathParameters?.sessionId);

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	if (!sessionId) {
		return responses.badRequest({
			message: 'Missing parameter: sessionId',
		});
	}

	try {
		// Get all questions belong to the current session
		const session = await Session.findOne({
			where: {
				id: sessionId,
			},
			attributes: ['name'],
			include: [
				{
					model: Question,
					attributes: ['id', 'title'],
					include: [
						{
							model: QuestionGrade,
							attributes: [
								[Sequelize.fn('avg', Sequelize.col('points')), 'avgPoints'],
								'maxPoints',
							],
							where: {
								sessionId: sessionId,
							},
						},
					],
				},
			],
			group: ['Questions.id'],
		});
		if (!session) {
			return responses.notFound();
		}

		let classMax = 0;
		session.get().Questions?.forEach((question) => {
			classMax += question.QuestionGrades[0].maxPoints;
		});

		// Get all students belong to the current course from Canvas
		const canvasStudents: CanvasStudent[] = await getStudents(
			currentUser.canvasId,
			courseId
		);

		let classTotal = 0;

		// Get grades for each student
		const students = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				const sessionGradeId = (
					await SessionGrade.findOne({
						where: { sessionId: sessionId, userId: student.id },
					})
				)?.get().id;

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

				let studentTotal = 0;

				user?.get().QuestionGrades?.forEach((grade) => {
					studentTotal += grade.points;
				});

				classTotal += studentTotal;

				return {
					name: student.name,
					total: studentTotal,
					...user?.get(),
				};
			})
		);

		const classAverage = classTotal / canvasStudents.length;

		return responses.ok({
			classAverage: { points: classAverage, maxPoints: classMax },
			students,
			session: session.get(),
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
	const currentUser: APIGatewayEventDefaultAuthorizerContext= event.requestContext.authorizer || {};
	const courseId = event.pathParameters?.courseId;

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

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
			createAssignment(currentUser.canvasId, courseId, assignmentName, assignmentPoints), // Create a new assignment
			getStudents(currentUser.canvasId, courseId), // Get all students belong to the current course from Canvas
		]);

		// Calculate assignment points for each students
		const grades = await Promise.all(
			canvasStudents.map(async (student: CanvasStudent) => {
				let totalPoints = 0;
				let totalMaxPoints = 0;
				await Promise.all(
					sessionIds.map(async (sessionId: number) => {
						const sessionGrade = await SessionGrade.findOne({
							where: {
								sessionId: sessionId,
								userId: student.id,
							},
						});

						totalPoints += Number(sessionGrade?.get().points);
						totalMaxPoints += Number(sessionGrade?.get().maxPoints);
					})
				);

				return {
					id: student.id,
					points: (totalPoints / totalMaxPoints) * assignmentPoints,
				};
			})
		);

		await postGrades(currentUser.canvasId, courseId, assignmentId, grades);

		return responses.ok({
			message: 'success',
		});
	} catch (error) {
		console.log(error);
		return responses.internalServerError({
			error,
		});
	}
};

export const setQuestionsGrades: APIGatewayProxyHandler = async (event) => {
	const currentUser: APIGatewayEventDefaultAuthorizerContext= event.requestContext.authorizer || {};
	const courseId = event.pathParameters?.courseId;
	const sessionId = Number(event.pathParameters?.sessionId);

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	if (!sessionId) {
		return responses.badRequest({
			message: 'Missing parameter: sessionId',
		});
	}

	try {
		await calculate(courseId, sessionId, Number(currentUser.canvasId));
		return responses.ok();
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};
