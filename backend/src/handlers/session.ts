import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Session, Session_Question, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

const mockUserid = 1;

// GET /api/v1/cousrse/:courseId/session/:sessionId
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const sessionId = event.pathParameters?.sessionId;
	try {
		const session = await Session.findOne({
			where: {
				id: sessionId,
				userId: mockUserid,
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
	const questions = body.questions;

	if (!questions || !body) {
		return responses.badRequest({
			message: 'Missing paramters. courseId and questions all required',
		});
	}

	try {
		const data = await Session.create({
			name: Date.now().toString(),
			courseId: courseId as string,
			userId: mockUserid,
		});

		await Session_Question.bulkCreate(
			questions.map((questionId: number) => {
				return {
					sessionId: data.get().id,
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
