import { Connection } from '../../util/websocket';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

let connection: Connection;
let room: string;
let question: Question;

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	// initialize connection to redis/apigateway
	if (!connection) {
		connection = new Connection();
		connection.init(event);
	}

	try {
		const params = JSON.parse(event?.body || '{}');

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

interface QuestionOption {
	id: number;
	createdAt: string;
	questionId: number;
	responseCount: number;
	text: string;
	isAnswer: boolean;
	updatedAt: string;
}

interface Question {
	question: string;
	correctnessPoints: number;
	responseCount: number;
	title: string;
	QuestionOptions: QuestionOption[];
	folderId: number;
	participationPoints: number;
	createdAt: string;
	isClosed: boolean;
	interacted: boolean; //did the professor close, view, or view correct responses?
	progress: number;
	id: number;
	courseId: string;
	updatedAt: string;
}
