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

		// make sure room does not already exist before creating
		// a new key in redis	
		if(!(await connection.roomExists(room))){
			await connection.addProfessor(room, event?.requestContext.connectionId)
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `created room ${room}`
				})
			}
		} else { // if room already exists return error
			return {
				statusCode: 400, 
				body: JSON.stringify({
					message: `error, room ${room} already exists`
				})
			}
		}
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