import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import responses from '../util/api/responses';
import { verifyAuthentication } from '../util/auth';

export const handler: APIGatewayProxyHandler = async (event) => {
	// decode the jwt token
	const user = verifyAuthentication(event.headers);

	if (!user) {
		return responses.unauthorized();
	}

	if (!event.body) {
		return responses.badRequest({ message: 'Missing body' });
	}

	const body = JSON.parse(event.body);

	if (!body || !body.method || !body.url) {
		return responses.badRequest({ message: 'Missing body' });
	}

	try {
		// fetch canvas resource
		const res = await fetch(`${process.env.CANVAS_URL}${body.url}`, {
			method: body.method,
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		const payload = await res.json();

		return responses.ok({ payload });
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};
