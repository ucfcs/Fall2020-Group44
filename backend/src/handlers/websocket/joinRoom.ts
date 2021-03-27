import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let room: string;

const student = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamodb/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		// get room from payload
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		// if the room exists, add this connectionID to the room
		return await connection.joinRoom(
			room,
			event?.requestContext.connectionId as string,
			false
		);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error connecting to room: ${error}`,
			}),
		};
	}
};

const professor = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to dynamodb/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		// get room from payload
		room = params?.courseId;
		if (!room) throw 'courseId not provided in payload';

		// if the room exists, add this connectionID to the room
		return await connection.joinRoom(
			room,
			event?.requestContext.connectionId as string,
			true
		);
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: `error connecting to room: ${error}`,
			}),
		};
	}
};

export { student, professor };
