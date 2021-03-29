import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import fetch from 'node-fetch';

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
	try {
		const bearer = headers['Authorization'];

		if (!bearer) {
			return null;
		}

		const token = bearer.substr(7);

		if (!token) {
			return null;
		}

		return decode<UserAttributes>(token);
	} catch (error) {
		return null;
	}
}

export async function refreshUserToken(
	user: UserAttributes
): Promise<string | null> {
	try {
		// request a new token from Canvas
		const res = await fetch(`${process.env.CANVAS_URL}/login/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'refresh_token',
				client_id: process.env.CANVAS_ID,
				client_secret: process.env.CANVAS_KEY,
				redirect_uri: process.env.CANVAS_REDIRECT,
				refresh_token: user.refreshToken,
			}),
		});
		const payload = await res.json();

		if (res.status === 200) {
			// now lets update our user token columns
			await User.update(
				{
					token: payload.access_token,
				},
				{
					where: {
						id: user.id,
					},
					limit: 1,
				}
			);

			user.token = payload.access_token;

			return encode(user);
		} else {
			return null;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}
