import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let courseId: string | null;

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		// check if disconnected user was a professor:
		courseId = await connection.isProfessor(
			event?.requestContext.connectionId as string
		);

		// if it was, close the room
		if (courseId) {
			console.log('a professor disconnected, closing the room');
			await connection.closeRoom(courseId);

			console.log(
				`professor disconnected, successfully closed room ${courseId}`
			);
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `professor disconnected, successfully closed room ${courseId}`,
				}),
			};
		}

		// otherwise it was just a student, nothing to do

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'disconnect successful',
			}),
		};
	} catch (error) {
		console.log(
			`There was an error disconnecting: ${event?.requestContext.connectionId} `
		);
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'error disconnecting',
			}),
		};
	}
};
