import { BACKEND_URL } from '../../.env.json';

export function oauthMobileURL() {
	return fetch(`${BACKEND_URL}/dev/api/v1/auth/mobile/url`).then(toJSON);
}

export function oauthMobileRevoke(token: string) {
	return fetch(`${BACKEND_URL}/dev/api/v1/auth/mobile/revoke`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(toJSON);
}

function toJSON(res: Response) {
	return res.json();
}
