import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	try {
		// nothing to do here
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'disconnect successful',
			}),
		};
	} catch (error) {
		console.log(
			`There was an error disconnecting: ${event?.requestContext.connectionId} `
		);
		console.log(error);
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'error disconnecting',
			}),
		};
	}
};
