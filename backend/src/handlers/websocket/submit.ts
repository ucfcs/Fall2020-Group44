import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let courseId: string;
let questionId: string;
let questionOptionId: string;
let userId: string;
let collectionId: string;

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
		collectionId = params?.collectionId;

		if (
			!courseId ||
			!questionId ||
			!questionOptionId ||
			!userId ||
			!collectionId
		)
			throw 'all of courseId, questionId, questionOptionId, collectionId, and userId required';

		return await connection.submitResponse(
			courseId,
			questionId,
			questionOptionId,
			userId,
			collectionId
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
