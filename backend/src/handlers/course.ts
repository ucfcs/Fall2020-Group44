import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Course, Folder, Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

// GET /api/v1/course
const getCourse = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.courseId) {
		return responses.badRequest({
			message: 'Missing parameter: courseId',
		});
	}

	try {
		const [course, folders, questions] = await Promise.all([
			Course.findOne({
				where: {
					id: params?.courseId,
				},
			}),
			Folder.findAll({
				where: {
					courseId: params.courseId,
				},
				include: {
					model: Question,
					include: [QuestionOption],
				},
			}),
			Question.findAll({
				where: {
					courseId: params.courseId,
					folderId: null,
				},
				include: [QuestionOption],
			}),
		]);

		return responses.ok({
			data: { ...course?.get(), folders, questions },
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

export { getCourse };
