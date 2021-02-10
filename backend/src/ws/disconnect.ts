const { Connection } = require('./connections.js')

import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

let connection: typeof Connection;
const host = process.env.REDIS_HOST;
const port = 6379;


export const handler = async (
  event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {
	
	if (!connection) {
    connection = new Connection({ host, port })
    connection.init(event);
  }
	
	try {
		// TODO: 
		// 1. check if connection was the professor.
		//    if it was, we need to end the session and delete the room
		// 2. if it wasn't, remove the student from the room
		// 3. update the professor that a student disconnected
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "connection successful"
			})
		 };

	} catch (error) {
		console.log("THERE WAS AN ERROR");
		throw error;
	}

};