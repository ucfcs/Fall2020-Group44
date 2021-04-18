import { APIGatewayProxyHandler } from 'aws-lambda';

import { User } from '../models';
import responses from '../util/api/responses';
import { encode } from '../util/token';

// declare lambda function
export const launch: APIGatewayProxyHandler = async () => {
	const devUserId = 1;
	const devCourseId = 1;
	try {
		let user = await User.findOne({
			where: {
				canvasId: 1,
			},
		});

		if (!user) {
			user = await User.create({
				canvasId: devUserId,
				token: '',
				refreshToken: '',
			});
		}

		const token = encode(user.get());

		return responses.movedPermanently(
			`http://localhost:3000/course/${devCourseId}/?token=${token}`
		);
	} catch (error) {
		return responses.internalServerError(error);
	}
};
