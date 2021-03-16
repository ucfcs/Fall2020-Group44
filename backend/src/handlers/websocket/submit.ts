import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let courseId: string;
let questionId: string;
let questionOptionId: string;
let userId: string;
let sessionId: string;

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to redis/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		// get vars from payload
		courseId = params?.courseId;
		questionId = params?.questionId;
		questionOptionId = params?.questionOptionId;
		userId = params?.userId;
		sessionId = params?.sessionId;

		if (!courseId || !questionId || !questionOptionId || !userId || !sessionId)
			throw 'all of courseId, questionId, questionOptionId, sessionId, and userId required';

		return await connection.sumbitResponse(
			courseId,
			questionId,
			questionOptionId,
			userId,
			sessionId
		);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'error submitting response',
			}),
		};
	}
};
