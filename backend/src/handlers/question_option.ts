import { APIGatewayProxyHandler } from 'aws-lambda';
import { QuestionOption } from '../models';
import responses from '../util/api/responses';

export const create: APIGatewayProxyHandler = async (event) => {
	const body = JSON.parse(event.body || '{}');
	const questionId = event.pathParameters?.questionId;

	if (!questionId) {
		return responses.badRequest({
			message: 'Missing questionId path parameter',
		});
	}

	try {
		const result = await QuestionOption.create({
			text: String(body?.text),
			isAnswer: body?.isAnswer == 'true',
			questionId: parseInt(questionId),
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

export const updateOne: APIGatewayProxyHandler = async (event) => {
	const body = JSON.parse(event.body || '{}');
	const questionOptionId = event.pathParameters?.optionId;

	if (!questionOptionId) {
		return responses.badRequest({
			message: 'Missing questionOptionId parameter',
		});
	}

	try {
		await QuestionOption.update(
			{ text: String(body?.text), isAnswer: body?.isAnswer == 'true' },
			{ where: { id: questionOptionId } }
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

export const updateMany: APIGatewayProxyHandler = async (event) => {
	const questionId: number = Number.parseInt(
		event.pathParameters?.questionId as string,
		10
	);
	let body: QuestionlOptionAttributes[];

	if (!questionId || Number.isNaN(questionId)) {
		return responses.badRequest({
			message: 'The question id was not set.',
		});
	}

	// lets check if they body was propperly formatted
	try {
		body = JSON.parse(event.body || '[]');
	} catch (error) {
		return responses.badRequest({
			message: 'The body was not a proper JSON string.',
		});
	}

	if (!Array.isArray(body)) {
		return responses.badRequest({
			message: 'The body was not an array of question options.',
		});
	}

	if (body.length <= 0) {
		return responses.badRequest({
			message: 'Question options were an empty array.',
		});
	}

	try {
		const oldQuestionOptions = await QuestionOption.findAll({
			where: { questionId },
		});
		const upsertP = [];
		const removeP = [];

		// add new or update
		for (const { id, text, isAnswer } of body) {
			upsertP.push(
				QuestionOption.upsert({
					id,
					text,
					isAnswer,
					questionId,
				})
			);
		}

		// remove questions that were removed
		for (const oldQuestionOption of oldQuestionOptions) {
			for (const newQuestionOption of body) {
				if (oldQuestionOption.get().id === newQuestionOption.id) {
					break;
				}
			}

			removeP.push(
				QuestionOption.destroy({
					where: {
						id: oldQuestionOption.get().id,
					},
				})
			);
		}

		await Promise.all(upsertP);
		await Promise.all(removeP);

		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		console.error(error);
		return responses.badRequest({
			message: error.name || 'Fail to update',
		});
	}
};

export const remove: APIGatewayProxyHandler = async (event) => {
	const questionOptionId = event.pathParameters?.optionId;

	if (!questionOptionId) {
		return responses.badRequest({
			message: 'Missing questionOptionId parameter',
		});
	}

	try {
		await QuestionOption.destroy({ where: { id: questionOptionId } });

		return responses.ok({
			message: 'Success',
		});
	} catch (error) {
		return responses.badRequest({
			message: error.name || 'Fail to create',
		});
	}
};
