import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { User } from '../models/User';
import { decode, encode } from './token';

/**
 * Here well run through some logic to figure out
 * if we have a user already with that UserId
 * if we do then we grab that rows data and inject it into a JWT
 * if we do NOT then well create a row and then inject the row data into a JWT
 */
export async function userAuthFlowGetToken(
	userId: UserId,
	token: string,
	refreshToken: string
): Promise<string> {
	try {
		// does row exist with the give UserId
		let user: UserAttributes;
		const row = await User.findOne({ where: { id: userId }, limit: 1 });

		if (!row) {
			// create a row
			const status = await User.create({
				canvasId: userId,
				token,
				refreshToken,
			});

			user = status.get({ clone: true });
		} else {
			// update the row
			await User.update(
				{
					token,
					refreshToken,
				},
				{ where: { id: userId }, limit: 1 }
			);

			user = row.get({ clone: true });
			user.token = token;
			user.refreshToken = refreshToken;
		}

		// build JWT
		return encode(user);
	} catch (error) {
		console.error(error);
		return '';
	}
}

export function verifyAuthentication(
	headers: APIGatewayProxyEventHeaders
): UserAttributes | null {
	const bearer = headers['Authorization'];

	if (!bearer) {
		return null;
	}

	const token = bearer.substr(7);

	if (!token) {
		return null;
	}

	try {
		return decode<UserAttributes>(token);
	} catch (error) {
		return null;
	}
}
