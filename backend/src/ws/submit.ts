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