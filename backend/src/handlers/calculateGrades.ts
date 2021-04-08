import { ProxyResult } from 'aws-lambda';
import {
	QuestionUserResponse,
	SessionGrade,
	QuestionGrade,
	Question,
	Session,
	QuestionOption,
} from '../models';
import responses from '../util/api/responses';

// import fetch from 'node-fetch';

const calculate = async (
	courseId: string,
	sessionId: number
): Promise<ProxyResult> => {
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

		console.log(sessionQuestions);

		console.log(questionIdMap);
		console.log(`max points for a session: ${maxPoints}`);

		//get all students in a course:
		// fetch(`https://webcourses.ucf.edu/api/v1/courses/${courseId}/users`, {
		// 	method: 'GET',
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 	},
		// 	body: { // not sure if this is correct
		// 		enrollment_role: 'StudentEnrollment',
		// 		per_page: 100,
		// 	},
		// });

		const mockUsers = Array.from({ length: 25 }, (_, i) => i + 1);
		console.log(mockUsers);

		mockUsers.forEach(async (user) => {
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

			console.log(userResponses);

			// if there are any user responses for that user,
			// iterate thru them and update their grade for
			// each question they responded to in the session
			if (userResponses) {
				console.log('loop thru user Responses');
				userResponses.forEach((response) => {
					// grade response
					const index = questionIdMap.get(response.get().questionId);
					if (index === undefined) {
						return;
					}

					const question = sessionQuestions[index];

					const participationPoints = question.participationPoints;
					let correctnessPoints = 0;
					console.log('loop thru questionOptions');
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

			console.log('create grade');
			// update session grades with their responses
			await SessionGrade.create(userSessionGrade, {
				include: [
					{
						model: QuestionGrade,
						as: 'QuestionGrades',
					},
				],
			});
		});

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
};

export { calculate };
