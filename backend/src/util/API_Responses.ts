import { ProxyResult } from 'aws-lambda';

const Responses = {
	_200(data = {}): ProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 200,
			body: JSON.stringify(data),
		};
	},

	_400(data = {}): ProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
			},
			statusCode: 400,
			body: JSON.stringify(data),
		};
	},

	_301(url: string, data = {}): ProxyResult {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Origin': '*',
				Location: url,
			},
			statusCode: 301,
			body: JSON.stringify(data),
		};
	},
};

export default Responses;
