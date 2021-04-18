import { BACKEND_URL } from '../../.env.json';
import { toJSON } from '../util';

export function oauthMobileURL() {
	return fetch(`${BACKEND_URL}/api/v1/auth/mobile/url`).then(toJSON);
}

export function oauthMobileRevoke(token: string) {
	return fetch(`${BACKEND_URL}/api/v1/auth/mobile/revoke`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(toJSON);
}
