import { APIGatewayProxyHandler, ProxyResult } from 'aws-lambda';
import {
	Question,
	QuestionGrade,
	Session,
	SessionGrade,
	User,
	QuestionUserResponse,
	QuestionOption,
} from '../models';
import responses from '../util/api/responses';
import { createAssignment, getStudents, postGrades } from '../util/canvas';
import { Sequelize } from 'sequelize';
import { verifyAuthentication } from '../util/auth';

export const getSessionsGrades: APIGatewayProxyHandler = async (event) => {
	const courseId = event.pathParameters?.courseId;

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	//
	// Auth middle
	//
	const currentUser = verifyAuthentication(event.headers);

	if (!currentUser) {
		return responses.unauthorized();
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

export const getQuestionsGrades: APIGatewayProxyHandler = async (event) => {
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

	//
	// Auth middle
	//
	const currentUser = verifyAuthentication(event.headers);

	if (!currentUser) {
		return responses.unauthorized();
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
				const user = await User.findOne({
					attributes: ['canvasId'],
					where: { canvasId: student.id },
					include: {
						model: QuestionGrade,
						attributes: ['id', 'points', 'maxPoints'],
						where: {
							sessionId: sessionId,
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

export const exportGrades: APIGatewayProxyHandler = async (event) => {
	const courseId = event.pathParameters?.courseId;

	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	//
	// Auth middle
	//
	const currentUser = verifyAuthentication(event.headers);

	if (!currentUser) {
		return responses.unauthorized();
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
			createAssignment(
				currentUser.canvasId,
				courseId,
				assignmentName,
				assignmentPoints
			), // Create a new assignment
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

	//
	// Auth middle
	//
	const currentUser = verifyAuthentication(event.headers);

	if (!currentUser) {
		return responses.unauthorized();
	}

	try {
		return await calculate(courseId, sessionId, Number(currentUser.canvasId));
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};

//
// helper function to calculate grades
//
async function calculate(
	courseId: string,
	sessionId: number,
	userId: number
): Promise<ProxyResult> {
	try {
		//get the questions for that session to calculate the max points
		const session = await Session.findOne({
			// raw: true,
			where: {
				id: sessionId,
			},
			include: {
				model: Question,
				include: [QuestionOption],
			},
		});

		if (!session) {
			return responses.badRequest({
				message: `404 session not found with session id ${sessionId}`,
			});
		}

		const sessionQuestions: QuestionAttributes[] =
			session.get().Questions?.map((question) => question.get()) || [];

		if (!sessionQuestions || sessionQuestions.length <= 0) {
			return responses.badRequest({
				message: `404 session ${sessionId} has no questions`,
			});
		}

		sessionQuestions.forEach((question) => {
			question.QuestionOptions.map((qOption) => qOption.get());
		});

		let maxPoints = 0;
		// map questionId to index in the array so that we can quickly change the grade for it later
		const questionIdMap = new Map<number, number>();

		sessionQuestions.forEach((question, index: number) => {
			const q: QuestionAttributes = question;
			maxPoints += q.participationPoints + q.correctnessPoints;
			questionIdMap.set(q.id, index);
		});

		const users: number[] = (await getStudents(userId, courseId)).map(
			(student) => student.id
		);

		await Promise.all(
			users.map(async (user) => {
				// initialize SessionGrade Object with zero points:
				const userSessionGrade = {
					courseId: courseId,
					userId: user,
					sessionId: sessionId,
					points: 0,
					maxPoints: maxPoints,
					QuestionGrades: sessionQuestions.map((question) => {
						return {
							courseId: courseId,
							userId: user,
							sessionId: sessionId,
							questionId: question.id,
							points: 0,
							maxPoints:
								question.participationPoints + question.correctnessPoints,
						};
					}),
				};

				// get user responses for this session
				const userResponses = await QuestionUserResponse.findAll({
					where: {
						sessionId: sessionId,
						userId: user,
					},
				});

				// if there are any user responses for that user,
				// iterate thru them and update their grade for
				// each question they responded to in the session
				if (userResponses) {
					userResponses.forEach((response) => {
						// grade response
						const index = questionIdMap.get(response.get().questionId);
						if (index === undefined) {
							return;
						}

						const question = sessionQuestions[index];

						const participationPoints = question.participationPoints;
						let correctnessPoints = 0;
						question.QuestionOptions.forEach(
							(qOption: QuestionlOptionAttributes) => {
								if (qOption.isAnswer) {
									if (response.get().questionOptionId == qOption.id) {
										correctnessPoints = question.correctnessPoints;
									}
								}
							}
						);

						userSessionGrade.QuestionGrades[index].points =
							participationPoints + correctnessPoints;

						userSessionGrade.points += participationPoints + correctnessPoints;
					});
				}

				// update session grades with their responses
				await SessionGrade.create(userSessionGrade, {
					include: [
						{
							model: QuestionGrade,
							as: 'QuestionGrades',
						},
					],
				});
			})
		);

		return responses.ok({
			message: `Success calculating grades for sessionId ${sessionId}`,
		});
	} catch (error) {
		return responses.badRequest({
			message:
				error.name || `Failed to Calculate Grades for session ${sessionId}`,
			error: error,
		});
	}
}
