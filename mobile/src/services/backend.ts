import env from '../../.env.json';

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
	});
}
