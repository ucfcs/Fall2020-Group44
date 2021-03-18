import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { Question, QuestionOption } from '../models';
import responses from '../util/api/responses';

// GET /api/v1/question
const get = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.questionId) {
		return responses.badRequest({ message: 'Missing questionId' });
	}

	try {
		const question = await Question.findOne({
			where: {
				id: params?.questionId,
			},
			include: {
				model: QuestionOption,
			},
		});

		return responses.ok({
			question,
		});
	} catch (error) {
		return responses.badRequest({
			message: error || 'Fail to query',
		});
	}
};

// POST /api/v1/question
const create = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.folderId) {
		return responses.badRequest({ message: 'Missing folderId parameter' });
	}

	try {
		const result = await Question.create(
			{
				title: String(body.title),
				question: String(body.question),
				folderId: parseInt(params?.folderId),
				QuestionOptions: body.questionOptions,
			},
			{
				include: [
					{
						model: QuestionOption,
						as: 'QuestionOptions',
					},
				],
			}
		);

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

// PUT /api/v1/question
const update = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const body = JSON.parse(event.body || '{}');
	const params = event.queryStringParameters;

	if (!params?.questionId) {
		return responses.badRequest({ message: 'Missing questionId parameter' });
	}

	try {
		await Question.update(
			{ question: String(body.question || '') },
			{ where: { id: params?.questionId } }
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

// DELETE /api/v1/question
const remove = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	const params = event.queryStringParameters;

	if (!params?.questionId) {
		return responses.badRequest({ message: 'Missing questionId parameter' });
	}

	try {
		await Question.destroy({ where: { id: params?.questionId } });

		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to create',
		});
	}
};

export { get, create, update, remove };
