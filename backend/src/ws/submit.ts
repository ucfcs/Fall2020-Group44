const { Connection } = require('./dbconnections.js')
import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

let connection: typeof Connection;
let room: String;

export const handler = async (
	event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {

	// initialize connection to redis/apigateway
	if (!connection) {
    connection = new Connection()
    connection.init(event);
	}
	
	try {

		//TODO: once PollUserResponse is created
		
	} catch (error) {  
		console.log(error)
		return {
			statusCode: 400, 
			body: JSON.stringify({
				message: `error submitting response`
			})
		}
	}
};