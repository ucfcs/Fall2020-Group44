import { Connection } from './dbconnections';
import {
	APIGatewayEvent,
	APIGatewayProxyEvent,
	Context,
	ProxyResult,
} from 'aws-lambda';

let connection: Connection;
// let room: string;
// let questionId: string;
// let questionOptionId: string;
// let userId: string;

export const handler = async (
	event?: APIGatewayEvent,
	content?: Context
): Promise<ProxyResult> => {
	// initialize connection to redis/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		// get room from payload
		const { courseId, questionId, questionOptionId, userId } = params;
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
