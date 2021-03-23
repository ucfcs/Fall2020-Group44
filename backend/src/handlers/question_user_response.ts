import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { QuestionUserResponse } from '../models/QuestionUserResponse';
import responses from '../util/api/responses';

// POST /api/v1/question_user_response
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = JSON.parse(event.body || '{}');
	const questionId = event.pathParameters?.questionId;

	if (!params.userId || !params.questionOptionId || !params.sessionId) {
		return responses.badRequest({
			message:
				'Missing parameter: userId, sessionId, and questionOptionId all required',
		});
	}

	if (!questionId) {
		return responses.badRequest({
			message: 'Missing questionId path parameter',
		});
	}

	try {
		const result = await QuestionUserResponse.create({
			questionId: parseInt(questionId),
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
	const questionId = event.pathParameters?.questionId;

	if (!params?.userId || !params?.sessionId) {
		return responses.badRequest({
			message: 'Missing parameter: userId, and sessionId required',
		});
	}

	if (!questionId) {
		return responses.badRequest({
			message: 'Missing questionId path parameter',
		});
	}

	try {
		await QuestionUserResponse.destroy({
			where: {
				questionId: questionId,
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

const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = JSON.parse(event.body || '{}');
	const questionId = event.pathParameters?.questionId;

	if (!params.userId || !params.questionOptionId || !params.sessionId) {
		return responses.badRequest({
			message:
				'Missing parameter: userId, sessionId, and questionOptionId all required',
		});
	}

	if (!questionId) {
		return responses.badRequest({
			message: 'Missing questionId path parameter',
		});
	}

	try {
		await QuestionUserResponse.update(
			{ questionOptionId: parseInt(params.questionOptionId) },
			{
				where: {
					questionId: questionId,
					userId: params.userId,
					sessionId: params.sessionId,
				},
			}
		);
		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to update',
		});
	}
};

const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;
	const questionId = event.pathParameters?.questionId;

	if (!params?.userId || !params?.sessionId) {
		return responses.badRequest({
			message: 'Missing parameter: userId, and sessionId all required',
		});
	}

	if (!questionId) {
		return responses.badRequest({
			message: 'Missing questionId path parameter',
		});
	}

	try {
		const result = await QuestionUserResponse.findOne({
			where: {
				questionId: questionId,
				userId: params.userId,
				sessionId: params.sessionId,
			},
		});

		return responses.ok({
			messgae: 'Success',
			response: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

export { create, remove, update, get };
