const { Connection } = require('./connections.js')
const AWS = require('aws-sdk')


import { APIGatewayEvent, APIGatewayProxyEvent, Context, ProxyResult } from "aws-lambda";

// let connection: typeof Connection;
// const host = process.env.REDIS_HOST;
// const port = 6379;
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'localhost', endpoint: 'http://localhost:8000' });

export const handler = async (
  event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {
	
	// if (!connection) {
  //   connection = new Connection({ host, port })
  //   connection.init(event);
  // }
	
	try {
		console.log(`connection added: ${event?.requestContext.connectionId}`)
		// console.log(await connection.addConnection('room9', event?.requestContext.connectionId))
  	// await connection.publish('room9', event, `${event?.requestContext.connectionId} joined to the room.`)

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