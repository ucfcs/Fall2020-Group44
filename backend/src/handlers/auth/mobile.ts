import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import responses from '../../util/api/responses';
import { userAuthFlowGetToken } from '../../util/auth';

/**
 * @see http://localhost:3000/dev/api/v1/auth/mobile/redirect
 */
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
		const data: CanvasOAuthResponses = await res.json();

		const token = await userAuthFlowGetToken(
			data.user.id,
			data.user.name,
			data.access_token,
			data.refresh_token
		);

		return responses.movedPermanently(
			`ucf-react://authentication?token=${token}`
		);
	} catch (error) {
		return responses.internalServerError(error);
	}
};

/**
 * @see http://localhost:3000/dev/api/v1/auth/mobile/url
 */
export const url: APIGatewayProxyHandler = async () => {
	return responses.ok({
		url: `${process.env.CANVAS_URL}/login/oauth2/auth?response_type=code&client_id=${process.env.CANVAS_ID}&redirect_uri=${process.env.CANVAS_REDIRECT}`,
	});
};
