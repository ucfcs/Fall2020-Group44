import { APIGatewayProxyHandler } from 'aws-lambda';
import response from '../../util/api/responses';

/**
 * @see http://localhost:3000/dev/api/v1/auth/lti
 */
export const launch: APIGatewayProxyHandler = async () => {
	// do we have a user with that info

	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};
