import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { QuestionUserResponse } from '../models/QuestionUserResponse';
import responses from '../util/api/responses';

// POST /api/v1/question_user_response
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = JSON.parse(event.body || '{}');

	if (
		!params.questionId ||
		!params.userId ||
		!params.questionOptionId ||
		!params.sessionId
	) {
		return responses.badRequest({
			message:
				'Missing parameter: questionId, userId, sessionId, and questionOptionId all required',
		});
	}

	try {
		const result = await QuestionUserResponse.create({
			questionId: parseInt(params.questionId),
			userId: parseInt(params.userId),
			sessionId: parseInt(params.sessionId),
			questionOptionId: parseInt(params.questionOptionId),
		});

		return responses.ok({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Failed to create',
			error: error,
		});
	}
};

// DELETE /api/v1/question_user_response
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.questionId || !params?.userId || !params?.sessionId) {
		return responses.badRequest({
			message: 'Missing parameter: questionId, userId, and sessionId required',
		});
	}

	try {
		await QuestionUserResponse.destroy({
			where: {
				questionId: params?.questionId,
				userId: params?.userId,
				sessionId: params?.sessionId,
			},
		});
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

export { create, remove };
