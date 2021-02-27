import AWS from 'aws-sdk';
import {
	APIGatewayEvent,
	APIGatewayProxyEvent,
	Context,
	ProxyResult,
} from 'aws-lambda';

export const handler = async (
	event?: APIGatewayEvent,
	content?: Context
): Promise<ProxyResult> => {
	try {
		console.log(`connection added: ${event?.requestContext.connectionId}`);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'connection successful',
			}),
		};
	} catch (error) {
		console.log('THERE WAS AN ERROR');
		throw error;
	}
};
