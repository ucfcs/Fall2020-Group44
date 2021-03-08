import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

interface QuestionObject {
	title: string;
	question: string;
	type: string;
	choices: string[];
	correct: number;
}

let connection: Connection;
let room: string;
let question: QuestionObject;

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to redis/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');
		console.log(params);
		// get room from payload
		room = params?.courseId;
		question = params?.question;
		if (!room) throw 'courseId not provided in payload';
		if (!question) throw 'question not provided in payload';

		return await connection.startQuestion(room, question);
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
