import { APIGatewayProxyHandler } from 'aws-lambda';
import response from '../../util/api/responses';

export const launch: APIGatewayProxyHandler = async () => {
	// do we have a user with that info

	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};
