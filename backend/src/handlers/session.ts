import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Session, SessionQuestion, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

// GET /api/v1/cousrse/:courseId/session/:sessionId
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const sessionId = event.pathParameters?.sessionId;
	try {
		const session = await Session.findOne({
			where: {
				id: sessionId,
			},
			include: {
				model: Question,
				include: [QuestionOption],
			},
		});

		return responses.ok({
			data: session,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/course/:courseid/session
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');

	const courseId = body.courseId;
	const questionIds = body.questionIds;

	if (!questionIds || !body) {
		return responses.badRequest({
			message: 'Missing paramters. courseId and questions all required',
		});
	}

	try {
		const data = await Session.create({
			name: new Date().toDateString(),
			courseId: courseId as string,
		});
		const sessionId = data.get().id;

		await SessionQuestion.bulkCreate(
			questionIds.map((questionId: number) => {
				return {
					sessionId,
					questionId,
				};
			})
		);

		return responses.ok({
			message: 'Success',
			data,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to create',
		});
	}
};

export { get, create };
