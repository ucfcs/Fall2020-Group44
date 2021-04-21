import { BACKEND_URL } from '../../env.json';
import { toJSON } from '../util';

export function oauthMobileURL(): Promise<GetOauthMobileURL> {
	return fetch(`${BACKEND_URL}/api/v1/auth/mobile/url`, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	}).then<GetOauthMobileURL>(toJSON);
}

export function oauthMobileRevoke(
	token: string,
): Promise<DeleteOauthMobileRevoke> {
	return fetch(`${BACKEND_URL}/api/v1/auth/mobile/revoke`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}).then<DeleteOauthMobileRevoke>(toJSON);
}
