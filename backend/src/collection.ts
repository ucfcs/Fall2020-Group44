import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Collection, Question } from './models';
import responses from './util/API_Responses';

const mockUserid = 1;

// GET /api/v1/collection
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.collectionId) {
		return responses._400({ message: 'Missing collectionId parameter' });
	}

	try {
		const collection = await Collection.findOne({
			where: {
				id: params?.collectionId,
				userId: mockUserid,
			},
			include: {
				model: Question,
			},
		});

		return responses._200({
			collection,
		});
	} catch (error) {
		return responses._400({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/collection
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.folderId) {
		return responses._400({ message: 'Missing folderId parameter' });
	}
	if (!params?.courseId) {
		return responses._400({ message: 'Missing courseId parameter' });
	}

	try {
		const result = await Collection.create({
			name: String(body.name),
			folderId: parseInt(params?.folderId),
			courseId: params?.courseId,
			userId: mockUserid,
			publishedAt: null,
		});

		return responses._200({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses._400({
			message: error || 'Fail to create',
		});
	}
};

// PUT /api/v1/collection
const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.collectionId) {
		return responses._400({ message: 'Missing collectionId parameter' });
	}

	try {
		await Collection.update(
			{ name: String(body.name) },
			{ where: { id: params?.collectionId } }
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

// DELETE /api/v1/collection
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.collectionId) {
		return responses._400({ message: 'Missing collectionId parameter' });
	}

	try {
		await Collection.destroy({ where: { id: params?.collectionId } });
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Success',
			}),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: error.name || 'Fail to create',
			}),
		};
	}
};

export { get, create, update, remove };
