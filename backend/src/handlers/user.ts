import { APIGatewayProxyHandler } from 'aws-lambda';

import { verifyAuthentication } from '../util/auth';
import responses from '../util/api/responses';
import { UserSetting } from '../models';

export const getUserSetting: APIGatewayProxyHandler = async (event) => {
	let platform: Platform = 'web';

	//
	// Auth middle
	//
	const user = verifyAuthentication(event.headers);

	if (!user) {
		return responses.unauthorized();
	}

	//
	// Query
	//
	if (event.queryStringParameters && event.queryStringParameters.platform) {
		platform = event.queryStringParameters.platform as Platform;
	}

	try {
		const settings = await UserSetting.findOne({
			where: {
				userId: user.id,
				platform,
			},
			limit: 1,
		});

		return responses.ok({ settings });
	} catch (error) {
		console.error(error);
		return responses.internalServerError();
	}
};

export const setUserSetting: APIGatewayProxyHandler = async (event) => {
	let platform: Platform = 'web';

	//
	// Auth middle
	//
	const user = verifyAuthentication(event.headers);

	if (!user) {
		return responses.unauthorized();
	}

	//
	// Query
	//
	if (event.queryStringParameters && event.queryStringParameters.platform) {
		platform = event.queryStringParameters.platform as Platform;
	}

	//
	// Parse Body
	//
	const document = event.body || JSON.stringify({});

	try {
		const isSettingSaved = await UserSetting.findOne({
			where: {
				platform,
				userId: user.id,
			},
			limit: 1,
		});

		if (!isSettingSaved) {
			await UserSetting.create({
				document,
				platform,
				userId: user.id,
			});
		} else {
			await UserSetting.update(
				{
					document,
				},
				{
					where: {
						userId: user.id,
						platform,
					},
					limit: 1,
				}
			);
		}

		return responses.ok({ success: true });
	} catch (error) {
		console.error(error);
		return responses.internalServerError({ success: false });
	}
};
