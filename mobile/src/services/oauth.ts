import { BACKEND_URL } from '../../.env.json';

export function oauthMobileURL() {
	return fetch(`${BACKEND_URL}/dev/api/v1/oauth/mobile/url`).then(toJSON);
}

function toJSON(res: Response) {
	return res.json();
}
