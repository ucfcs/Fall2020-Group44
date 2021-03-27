import { APIGatewayProxyHandler } from 'aws-lambda';

import sequelize from '../config/database';
import responses from '../util/api/responses';

// declare lambda function
export const world: APIGatewayProxyHandler = async (event, context) => {
	try {
		// Test the db connection and creds
		await sequelize.authenticate();

		// Use this code if you don't use the http event with the LAMBDA-PROXY integration
		// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
		return responses.ok({
			message: 'Go Serverless v1.0! Your function executed successfully!',
			event,
			context,
		});
	} catch (error) {
		return responses.internalServerError(error);
	}
};
