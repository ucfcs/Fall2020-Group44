import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let courseId: string;
let questionId: string;
let questionOptionId: string;
let userId: string;

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

		if (!courseId || !questionId || !questionOptionId || !userId)
			throw 'all of courseId, questionId, questionOptionId, and userId required';

		console.log(`${courseId} ${questionId} ${questionOptionId} ${userId}`);
		return await connection.sumbitResponse(
			courseId,
			questionId,
			questionOptionId,
			userId
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
