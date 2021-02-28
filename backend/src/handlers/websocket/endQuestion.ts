import { Connection } from './dbconnections';
import {
	APIGatewayEvent,
	APIGatewayProxyEvent,
	Context,
	ProxyResult,
} from 'aws-lambda';

let connection: Connection;
let room: string;

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
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		// tell all students in the room that this question has ended
		// can no longer submit responses
		return await connection.endQuestion(room);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error ending question: ${error}`,
			}),
		};
	}
};
