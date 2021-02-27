import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { QuestionUserResponse } from './models/QuestionUserResponse';
import responses from './util/API_Responses';

// POST /api/v1/question_user_response
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = JSON.parse(event.body || '{}');

	if (!params.questionId || !params.userId || !params.questionOptionId) {
		return responses._400({
			message:
				'Missing parameter: questionId, userId, questionOptionId all required',
		});
	}

	try {
		const result = await QuestionUserResponse.create({
			questionId: parseInt(params.questionId),
			userId: parseInt(params.userId),
			questionOptionId: parseInt(params.questionOptionId),
		});

		return responses._200({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses._400({
			message: error.name || 'Failed to create',
			error: error,
		});
	}
};

// DELETE /api/v1/question_user_response
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.questionId || !params?.userId) {
		return responses._400({
			message: 'Missing parameter: questionId and userId required',
		});
	}

	try {
		await QuestionUserResponse.destroy({
			where: { questionId: params?.questionId, userId: params?.userId },
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
