import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Folder } from './models/Folder';

const mockUserid = 1;

// GET /api/v1/folder
const getFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event?.queryStringParameters;

	if (!params?.courseId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'Missing parameters',
			}),
		};
	}

	try {
		const result = await Folder.findAll({
			where: {
				userId: mockUserid,
				courseId: params?.courseId,
			},
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				folderList: result,
			}),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: error.name || 'Fail to query',
			}),
		};
	}
};

// POST /api/v1/folder
const newFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	// eslint-disable-next-line no-constant-condition
	if (!params?.courseId || true) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'Missing parameters',
				event,
			}),
		};
	}

	try {
		const result = await Folder.create({
			name: body?.name as string,
			userId: mockUserid,
			courseId: params?.courseId as string,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Success',
				data: result,
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

// PUT /api/v1/folder
const updateFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event?.body || '{}');
	const params = event?.queryStringParameters;

	if (!params?.folderId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'Missing parameters',
			}),
		};
	}

	try {
		await Folder.update(
			{ name: body.name as string },
			{ where: { id: params?.folderId } }
		);
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
				message: error.name || 'Fail to update',
			}),
		};
	}
};

// DELETE /api/v1/folder
const deleteFolder = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event?.queryStringParameters;

	if (!params?.folderId) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'Missing parameters',
			}),
		};
	}

	try {
		await Folder.destroy({ where: { id: params?.folderId } });
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

export { getFolder, newFolder, updateFolder, deleteFolder };
