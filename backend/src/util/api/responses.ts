import { APIGatewayProxyResult } from 'aws-lambda';

export default {
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
	 */
	ok(data?: unknown): APIGatewayProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 200,
			body: JSON.stringify(data || {}),
		};
	},
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
	 */
	movedPermanently(url: string): APIGatewayProxyResult {
		return {
			headers: {
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
				Location: url,
			},
			statusCode: 301,
			body: '',
		};
	},
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
	 */
	badRequest(data?: unknown): APIGatewayProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 400,
			body: JSON.stringify(data || {}),
		};
	},
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
	 */
	unauthorized(data?: unknown): APIGatewayProxyResult {
		if (!data) {
			data = { message: 'Missing bearer token!' };
		}

		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 401,
			body: JSON.stringify(data || {}),
		};
	},
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
	 */
	internalServerError(data?: unknown): APIGatewayProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 500,
			body: JSON.stringify(data || {}),
		};
	},
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
	 */
	notFound(data?: unknown): APIGatewayProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 404,
			body: JSON.stringify(data || {}),
		};
	},
};
