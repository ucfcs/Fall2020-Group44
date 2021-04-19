import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import { SCOPES } from '../../config/canvas';

import responses from '../../util/api/responses';
import { verifyAuthentication } from '../../util/auth';

/**
 * @see http://localhost:5000/dev/api/v1/auth/mobile/url
 */
export const url: APIGatewayProxyHandler = async () => {
	return responses.ok({
		url:
			`${process.env.CANVAS_URL}/login/oauth2/auth?` +
			'response_type=code&' +
			`client_id=${process.env.CANVAS_ID}&` +
			`redirect_uri=${process.env.CANVAS_REDIRECT}&` +
			'state=mobile&' +
			`scope=${SCOPES.join(' ')}`,
	});
};

/**
 * @see http://localhost:5000/dev/api/v1/auth/mobile/revoke
 */
export const revoke: APIGatewayProxyHandler = async (event) => {
	const user = verifyAuthentication(event.headers);

	if (!user) {
		return responses.unauthorized();
	}

	try {
		await fetch(`${process.env.CANVAS_URL}/login/oauth2/token`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		});

		return responses.ok();
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};
