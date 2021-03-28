import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let room: string;
let sessionId: number;
let sessionName: string;

const start = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamo/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');

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

const end = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamo/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');

		// get params from payload
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		return await connection.endSession(room);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error ending session: ${error}`,
			}),
		};
	}
};

const join = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamo/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');

		// get params from payload
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		return await connection.joinSession(room);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error joining session: ${error}`,
			}),
		};
	}
};

const leave = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamo/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');

		// get params from payload
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		return await connection.leaveSession(room);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error leaving session: ${error}`,
			}),
		};
	}
};

export { start, end, join, leave };
