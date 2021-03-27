import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let room: string;
let sessionId: number;
let sessionName: string;

const start = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to redis/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		console.log(params);
		// get params from payload
		room = params?.courseId;
		sessionId = parseInt(params?.sessionId);
		sessionName = params?.sessionName;
		if (!room) throw 'courseId not provided in payload';
		if (!sessionId) throw 'sessionId not provided in payload';
		if (!sessionName) throw 'sessionName not provided in payload';

		return await connection.startSession(room, sessionId, sessionName);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error starting session: ${error}`,
			}),
		};
	}
};

export { start };
