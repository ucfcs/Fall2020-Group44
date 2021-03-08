import jwt from 'jsonwebtoken';

import { User } from '../models/User';

/**
 * Here well run through some logic to figure out
 * if we have a user already with that UserId
 * if we do then we grab that rows data and inject it into a JWT
 * if we do NOT then well create a row and then inject the row data into a JWT
 */
export async function userAuthFlowGetToken(
	userId: UserId,
	fullName?: string,
	token?: string,
	refreshToken?: string
): Promise<string> {
	try {
		// does row exist with the give UserId
		let user: UserAttributes;
		const row = await User.findOne({ where: { id: userId }, limit: 1 });

		if (!row) {
			// create a row
			const status = await User.create({
				canvasId: userId,
				fullName,
				token,
				refreshToken,
			});

			user = status.get({ clone: true });
		} else {
			user = row.get({ clone: true });
		}

		// build JWT
		return jwt.sign(user, 'cZL}5*^dVA_Kby-_'); // TODO: fix later
	} catch (error) {
		console.error(error);
		return '';
	}
}
