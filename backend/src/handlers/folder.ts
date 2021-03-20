import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Folder, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

const mockUserid = 1;

// GET /api/v1/folder
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const folderId = event.pathParameters?.folderId;

	try {
		const result = await Folder.findOne({
			where: {
				id: folderId,
			},
			include: {
				model: Question,
				include: [QuestionOption],
			},
		});

		return responses.ok({
			data: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/folder
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const courseId = event.pathParameters?.courseId;

	// eslint-disable-next-line no-constant-condition
	if (!courseId) {
		return responses.badRequest({
			message: 'Missing parameters',
		});
	}

	try {
		const result = await Folder.create({
			name: body?.name as string,
			courseId: courseId as string,
		});

		return responses.ok({
			data: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to create',
		});
	}
};

// PUT /api/v1/folder
const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const folderId = event.pathParameters?.folderId;

	if (!folderId) {
		return responses.badRequest({
			message: 'Missing parameter: folderId',
		});
	}

	try {
		await Folder.update(
			{ name: body.name as string },
			{ where: { id: folderId } }
		);
		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to update',
		});
	}
};

// DELETE /api/v1/folder
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const folderId = event.pathParameters?.folderId;

	if (!folderId) {
		return responses.badRequest({
			message: 'Missing parameter: folderId',
		});
	}

	try {
		await Folder.destroy({ where: { id: folderId } });
		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to delete',
		});
	}
};

export { get, create, update, remove };
