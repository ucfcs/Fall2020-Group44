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

		// make sure room exists in redis before joining
		//TODO: room doesn't exist yet, figure out what to check for
		if(await connection.roomExists(room)){
			await connection.addStudent(room, event?.requestContext.connectionId)
			console.log(`student added to room ${room}`)
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `connected to room ${room}`
				})
			}
		} else { // if room doesn't exist return error
			console.log(`room ${room} does not exist`)
			return {
				statusCode: 400, 
				body: JSON.stringify({
					message: `error, room ${room} does not exist`
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