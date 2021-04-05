import env from '../../.env.json';

//
// Canvas
//

export async function getCanvasSelf(token: string) {
	const res = await fetchCanvasProxy(token, {
		method: 'GET',
		url: '/api/v1/users/self',
	});

	if (res.status === 200) {
		return toJSON<GetCanvasSelfSuccess>(res);
	} else {
		return toJSON<CanvasError>(res);
	}
}

export async function getCanvasUserProfile(token: string) {
	const res = await fetchCanvasProxy(token, {
		method: 'GET',
		url: '/api/v1/users/:user_id/profile',
	});

	if (res.status === 200) {
		return toJSON<GetCanvasUserProfileSuccess>(res);
	} else {
		return toJSON<CanvasError>(res);
	}
}

export async function getCanvasUserEnrollments(token: string) {
	const res = await fetchCanvasProxy(token, {
		method: 'GET',
		url: '/api/v1/users/:user_id/enrollments',
	});

	if (res.status === 200) {
		return toJSON<GetCanvasUserEnrollmentsSuccess[]>(res);
	} else {
		return toJSON<CanvasError>(res);
	}
}

//
// User
//

export async function getUserSetting(token: string) {
	const res = await fetch(
		`${env.BACKEND_URL}/dev/api/v1/user/setting?platform=mobile`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return toJSON<GetUserSettingSuccess>(res);
}

export async function setUserSetting(token: string, settings: Settings) {
	const res = await fetch(
		`${env.BACKEND_URL}/dev/api/v1/user/setting?platform=mobile`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(settings),
		},
	);

	return toJSON<SetUserSettingSuccess>(res);
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
): Promise<Response> {
	return fetch(`${env.BACKEND_URL}/dev/api/v1/proxy/canvas`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});
}

function toJSON<T>(res: Response): Promise<T> {
	return res.json();
}
