import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Folder, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

const mockUserid = 1;

// GET /api/v1/folder
const getFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.courseId) {
		responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	try {
		const result = await Folder.findOne({
			where: {
				userId: mockUserid,
				courseId: params?.courseId,
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
const newFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	// eslint-disable-next-line no-constant-condition
	if (!params?.courseId) {
		return responses.badRequest({
			message: 'Missing parameters',
		});
	}

	try {
		const result = await Folder.create({
			name: body?.name as string,
			userId: mockUserid,
			courseId: params?.courseId as string,
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
const updateFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.folderId) {
		return responses.badRequest({
			message: 'Missing parameter: folderId',
		});
	}

	try {
		await Folder.update(
			{ name: body.name as string },
			{ where: { id: params.folderId } }
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
const deleteFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.folderId) {
		return responses.badRequest({
			message: 'Missing parameter: folderId',
		});
	}

	try {
		await Folder.destroy({ where: { id: params.folderId } });
		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to delete',
		});
	}
};

export { getFolder, newFolder, updateFolder, deleteFolder };
