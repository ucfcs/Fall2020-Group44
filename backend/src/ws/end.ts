const { Connection } = require('./connections.js')
import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

let connection: typeof Connection;
let room: String;
const host = process.env.REDIS_HOST;
const port = 6379;

export const handler = async (
	event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {

	// initialize connection to redis/apigateway
	if (!connection) {
    connection = new Connection({ host, port })
    connection.init(event);
	}
	
	try {
		// get room from payload
		room = JSON.parse(event.body).courseId
		if(!room) throw "courseId not provided in payload"
		
		// tell all students in the room that this question has ended
		// can no longer submit responses
		await connection.publish(room, "endQuestion")
		console.log(`ending question for room ${room}`)
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `successfully ended question in room ${room}`
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