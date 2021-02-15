const { Connection } = require('./dbconnections.js')
import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

let connection: typeof Connection;
let room: String;
// const host = process.env.REDIS_HOST;
// const port = 6379;

export const handler = async (
	event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {

	// // initialize connection to redis/apigateway
	// if (!connection) {
  //   connection = new Connection({ host, port })
  //   connection.init(event);
	// }

	// initialize connection to dynamodb/apigateway
	if (!connection) {
		connection = new Connection()
		connection.init(event);
	}
	
	try {
		// get room from payload	
		room = JSON.parse(event.body).courseId
		if(!room) throw "courseId not provided in payload"

		// if the room exists, add this connectionID to the room
		return await connection.addStudent(room, event?.requestContext.connectionId)
	} catch (error) {
		console.log(error)
		return {
			statusCode: 400, 
			body: JSON.stringify({
				message: `error connecting to room: ${error}`
			})
		}
	}
};