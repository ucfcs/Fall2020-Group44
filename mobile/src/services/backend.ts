import env from '../../.env.json';
import { toJSON } from '../util';

type CanvasSelfBody = {
	url: string;
	method: 'GET' | 'POST';
};

export function canvasSelf(token: string, body: CanvasSelfBody) {
	return fetch(`${env.BACKEND_URL}/dev/api/v1/proxy/canvas`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	}).then(toJSON);
}

export function getUserSetting(token: string) {
	return fetch(`${env.BACKEND_URL}/dev/api/v1/user/setting?platform=mobile`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(toJSON);
}

export function setUserSetting(token: string, settings: Settings) {
	return fetch(`${env.BACKEND_URL}/dev/api/v1/user/setting?platform=mobile`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(settings),
	}).then(toJSON);
}
