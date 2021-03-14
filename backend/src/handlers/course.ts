import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Course, Folder } from '../models';
import responses from '../util/api/responses';

// GET /api/v1/course
const getCourse = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.courseId) {
		return responses.badRequest({
			message: 'Missing parameters',
		});
	}

	try {
		const result = await Course.findOne({
			where: {
				id: params?.courseId,
			},
			include: {
				model: Folder,
			},
		});

		return responses.ok({
			course: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

export { getCourse };
