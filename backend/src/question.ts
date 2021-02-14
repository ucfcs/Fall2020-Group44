import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import querystring from 'querystring';
import { Question } from './models';
import responses from './util/API_Responses';

// GET /api/v1/question
const get = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event?.queryStringParameters;

	if (!params?.questionId) {
		return responses._400({ message: 'Missing questionId' });
	}

	try {
		const question = await Question.findOne({
			where: {
				id: params?.questionId,
			},
		});

		return responses._200({
			question,
		});
	} catch (error) {
		return responses._400({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/question
const create = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
	const body = querystring.parse(event?.body || '');
	const params = event?.queryStringParameters;

	if (!params?.collectionId) {
		return responses._400({ message: 'Missing collectionId parameter' });
	}

	try {
		const result = await Question.create({
			question: String(body.question),
			collectionId: parseInt(params?.collectionId),
			timeToAnswer: String(body?.timeToAnswer),
		});

		return responses._200({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses._400({
			message: error.name || 'Fail to create',
		});
	}
};

// PUT /api/v1/question
const update = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
	const body = querystring.parse(event?.body || '');
	const params = event?.queryStringParameters;

	if (!params?.questionId) {
		return responses._400({ message: 'Missing questionId parameter' });
	}

	try {
		await Question.update(
			{ question: String(body.question || '') },
			{ where: { id: params?.questionId } }
		);
		return responses._200({
			message: 'Success',
		});
	} catch (error) {
		return responses._400({
			message: error.name || 'Fail to update',
		});
	}
};

// DELETE /api/v1/question
const remove = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event?.queryStringParameters;

	if (!params?.questionId) {
		return responses._400({ message: 'Missing questionId parameter' });
	}

	try {
		await Question.destroy({ where: { id: params?.questionId } });

		return responses._200({
			message: 'Success',
		});
	} catch (error) {
		return responses._400({
			message: error.name || 'Fail to create',
		});
	}
};

export { get, create, update, remove };
