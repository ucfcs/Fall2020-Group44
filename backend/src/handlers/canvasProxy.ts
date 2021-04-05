import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import { verifyAuthentication } from '../util/auth';
import responses from '../util/api/responses';

export const handler: APIGatewayProxyHandler = async (event) => {
	// decode the jwt token
	const user = verifyAuthentication(event.headers);

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

		switch (res.status) {
			case 401:
				return responses.unauthorized(payload);
			default:
				return responses.ok(payload);
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
