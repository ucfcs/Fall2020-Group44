// const { Connection } = require('./connections.js')
const { Connection } = require('./dbconnections.js')
import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

interface QuestionObject {
	title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
}

let connection: typeof Connection;
var room: String;
var question: QuestionObject;
// const host = process.env.REDIS_HOST;
// const port = 6379;

export const handler = async (
	event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {

	// initialize connection to redis/apigateway
	if (!connection) {
    connection = new Connection()
    connection.init(event)
	}
	
	try {
		// get room and question from payload
		var body = JSON.parse(event?.body)
		room = body.courseId
		question = body.question
		if(!room) throw "courseId not provided in payload"
		if(!!question) throw "question not provided in payload"
		
		await connection.publish(room, "startQuestion", question)
		console.log(`starting question for room ${room}: `)
		console.log(question)
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `successfully started question in room ${room}`
			})
		}

	} catch (error) {
		console.log(error)
		return {
			statusCode: 400, 
			body: JSON.stringify({
				message: `error ending question: ${error}`
			})
		}
	}
};