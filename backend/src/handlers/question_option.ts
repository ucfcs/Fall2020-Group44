import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { QuestionOption } from '../models';
import responses from '../util/api/responses';

// POST /api/v1/question_option
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.questionId) {
		return responses.badRequest({ message: 'Missing questionId parameter' });
	}

	try {
		const result = await QuestionOption.create({
			text: String(body?.text),
			isAnswer: body?.isAnswer == 'true',
			questionId: parseInt(params?.questionId),
		});

		return responses.ok({
			message: 'Success',
			data: result,
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to create',
		});
	}
};

// PUT /api/v1/question_option
const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.questionOptionId) {
		return responses.badRequest({
			message: 'Missing questionOptionId parameter',
		});
	}

	try {
		await QuestionOption.update(
			{ text: String(body?.text), isAnswer: body?.isAnswer == 'true' },
			{ where: { id: params?.questionOptionId } }
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

// DELETE /api/v1/question_option
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.questionOptionId) {
		return responses.badRequest({
			message: 'Missing questionOptionId parameter',
		});
	}

	try {
		await QuestionOption.destroy({ where: { id: params?.questionOptionId } });

		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to create',
		});
	}
};

export { create, update, remove };
