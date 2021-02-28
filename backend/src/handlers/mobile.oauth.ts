import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import responses from '../util/api/responses';

export const redirect: APIGatewayProxyHandler = async (event) => {
	const { queryStringParameters } = event;

	// let us make sure the request was properly formatted
	if (!queryStringParameters) {
		return responses.badRequest({
			message: 'query string "code" is missing',
		});
	}

	try {
		// let us initiate the next step of the OAuth flow but sending the POST request with the auth code
		// see https://canvas.instructure.com/doc/api/file.oauth_endpoints.html#post-login-oauth2-token
		const res = await fetch(`${process.env.CANVAS_URL}/login/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.CANVAS_ID,
				client_secret: process.env.CANVAS_KEY,
				redirect_uri: process.env.CANVAS_REDIRECT,
				code: queryStringParameters.code,
			}),
		});
		const data = await res.json();

		return responses.ok(data);
	} catch (error) {
		return responses.internalServerError(error);
	}
};
