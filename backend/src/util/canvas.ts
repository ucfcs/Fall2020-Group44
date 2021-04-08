import fetch from 'node-fetch';
import querystring from 'querystring';
import { User } from '../models';

const getToken = async (userId: number): Promise<string> => {
	try {
		const user = await User.findOne({
			where: {
				id: userId,
			},
		});

		const res = await fetch(
			`${process.env.CANVAS_URL}/login/oauth2/token?` +
				querystring.encode({
					grant_type: 'refresh_token',
					client_id: process.env.CANVAS_ID,
					client_secret: process.env.CANVAS_KEY,
					refresh_token: user?.get().refreshToken,
				}),
			{
				method: 'POST',
			}
		);

		const data = await res.json();
		return data.access_token;
	} catch (error) {
		console.log('Error while fetching token:', error);
		return Promise.reject(error);
	}
};

export const getStudents = async (
	userId: number,
	courseId: number
): Promise<CanvasStudent[]> => {
	try {
		const token = await getToken(userId);
		const res = await fetch(
			`${process.env.CANVAS_URL}/api/v1/courses/${courseId}/students`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const data: CanvasStudent[] = await res.json();

		return data;
	} catch (error) {
		console.log('Error while fetching students:', error);
		return Promise.reject(error);
	}
};
