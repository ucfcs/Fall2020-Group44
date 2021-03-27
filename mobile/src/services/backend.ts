import env from '../../.env.json';
import { toJSON } from '../util';

//
// Canvas
//

export function getCanvasSelf(token: string) {
	return fetchCanvasProxy(token, {
		method: 'GET',
		url: '/api/v1/users/self',
	});
}

export function getCanvasUserEnrollments(token: string) {
	return fetchCanvasProxy(token, {
		method: 'GET',
		url: '/api/v1/users/:user_id/enrollments',
	});
}

//
// User
//

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

//
// Util
//

function fetchCanvasProxy(
	token: string,
	body: {
		method: 'GET' | 'POST';
		url: string;
	},
) {
	return fetch(`${env.BACKEND_URL}/dev/api/v1/proxy/canvas`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	}).then(toJSON);
}
