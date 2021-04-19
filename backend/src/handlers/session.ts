import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Session, SessionQuestion, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';
import { Connection } from '../util/websocket';

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
			userId: mockUserid,
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

		console.log('STARTING SESSIONNNNN');

		// emit to all the students that a session was just created
		const connection = new Connection();
		connection.init();
		await connection.startSession(courseId, data.get().id, data.get().name);

		console.log('SUCCESSFULLY STARTED SESSION');

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
