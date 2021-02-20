const { Connection } = require('./dbconnections.js')
import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";
import { ConnectionTimedOutError } from "sequelize/types";

let connection: typeof Connection;
let courseId: String;



export const handler = async (
  event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {
	
	if (!connection) {
    connection = new Connection()
    connection.init(event);
  }
	
	try {
		// check if disconnected user was a professor:
		courseId = await connection.isProfessor(event?.requestContext.connectionId);
		
		// if it was, close the room
		if(courseId) {
			await connection.closeRoom(courseId);

			console.log(`professor disconnected, successfully closed room ${courseId}`)
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `professor disconnected, successfully closed room ${courseId}`
				})
			}
		}

		// otherwise it was just a student, nothing to do

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "disconnect successful"
			})
		 };

	} catch (error) {
		console.log(`There was an error disconnecting: ${event?.requestContext.connectionId} `);
		throw error;
	}

};