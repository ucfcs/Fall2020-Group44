import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Collection, Question } from '../models';
import responses from '../util/api/responses';

const mockUserid = 1;

// GET /api/v1/collection
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const collectionId = event.pathParameters?.collectionId;

	if (!collectionId) {
		return responses.badRequest({
			message: 'Missing collectionId path parameter',
		});
	}

	try {
		const collection = await Collection.findOne({
			where: {
				id: collectionId,
				userId: mockUserid,
			},
			include: {
				model: Question,
			},
		});

		return responses.ok({
			collection,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/collection
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.folderId) {
		return responses.badRequest({ message: 'Missing folderId parameter' });
	}
	if (!params?.courseId) {
		return responses.badRequest({ message: 'Missing courseId parameter' });
	}

	try {
		const result = await Collection.create({
			name: String(body.name),
			folderId: parseInt(params?.folderId),
			courseId: params?.courseId,
			userId: mockUserid,
			publishedAt: null,
		});

		return responses.ok({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to create',
		});
	}
};

// PUT /api/v1/collection
const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.collectionId) {
		return responses.badRequest({ message: 'Missing collectionId parameter' });
	}

	try {
		await Collection.update(
			{ name: String(body.name) },
			{ where: { id: params?.collectionId } }
		);
		return responses.badRequest({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to update',
		});
	}
};

// DELETE /api/v1/collection
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.collectionId) {
		return responses.badRequest({ message: 'Missing collectionId parameter' });
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
				message: error.name || 'Fail to delete',
			}),
		};
	}
};

export { get, create, update, remove };
