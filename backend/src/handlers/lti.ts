import { APIGatewayProxyHandler } from 'aws-lambda';
import response from '../util/api/responses';

export const launch: APIGatewayProxyHandler = async () => {
	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};
