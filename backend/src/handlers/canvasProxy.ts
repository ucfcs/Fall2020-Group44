import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import { refreshUserToken, verifyAuthentication } from '../util/auth';
import responses from '../util/api/responses';

export const handler: APIGatewayProxyHandler = async (event) => {
	// decode the jwt token
	const user = verifyAuthentication(event.headers);
	let newJWT;

	if (!user) {
		return responses.unauthorized();
	}

	if (!event.body) {
		return responses.badRequest({ message: 'Missing body' });
	}

	const body: Body = JSON.parse(event.body);

	if (!body || !body.method || !body.url) {
		return responses.badRequest({ message: 'Missing body' });
	}

	// lets check if the url prop has params set
	if (body.url.includes(':user_id')) {
		body.url = body.url.replace(':user_id', user.canvasId.toString());
	}

	try {
		// fetch canvas resource
		const res = await fetch(`${process.env.CANVAS_URL}${body.url}`, {
			method: body.method,
			headers: {
				Authorization: `Bearer ${user.token}`,
				'Content-Type': 'application/json',
			},
		});
		const payload = await res.json();

		// if the request returns 401 then the users token has
		// most likely expired
		if (res.status === 401) {
			// lets refresh the users token
			newJWT = await refreshUserToken(user);
		}

		// if a newJWT was generated we need to include it
		// in the response object
		if (newJWT) {
			return responses.ok({
				payload,
				newJWT,
			});
		} else {
			return responses.ok({ payload });
		}
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};

interface Body {
	method: string;
	url: string;
}
