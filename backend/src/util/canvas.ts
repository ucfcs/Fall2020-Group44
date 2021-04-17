import fetch from 'node-fetch';
import querystring from 'querystring';
import { User } from '../models';

const getToken = async (userId: number): Promise<string> => {
	try {
		const user = await User.findOne({
			where: {
				canvasId: userId,
			},
		});

		if (!user) {
			return Promise.reject({ message: 'User does not exist.' });
		}

		const now = Date.now() / 1000;
		const tokenExpireTime = Number(user.get().tokenExpireTime || now);

		// The token is at least 60 seconds before the expire time
		if (tokenExpireTime - 60 <= now) {
			// Request a new token
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

			if (res.status != 200) {
				return Promise.reject({
					message: 'Error while fetching token from Canvas.',
				});
			}

			const data: CanvasOAuthResponses = await res.json();

			await User.update(
				{
					token: data.access_token,
					tokenExpireTime: now + Number(data.expires_in),
				},
				{
					where: {
						canvasId: userId,
					},
				}
			);

			return data.access_token;
		}

		return user.get().token;
	} catch (error) {
		console.log('Error while fetching token from Canvas.', error);
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

		if (res.status != 200) {
			return Promise.reject({
				message: 'Error while fetching students from Canvas.',
			});
		}

		const data: CanvasStudent[] = await res.json();

		return data;
	} catch (error) {
		console.log('Error while fetching students from Canvas.', error);
		return Promise.reject(error);
	}
};

export const createAssignment = async (
	userId: number,
	courseId: number,
	name: string,
	maxPoint: number
): Promise<number> => {
	try {
		const token = await getToken(userId);

		const res = await fetch(
			`${process.env.CANVAS_URL}/api/v1/courses/${courseId}/assignments?` +
				querystring.encode({
					'assignment[name]': name,
					'assignment[points_possible]': maxPoint,
					'assignment[published]': true,
				}),
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (res.status != 200 && res.status != 201) {
			return Promise.reject({
				message: 'Error while creating assignment in Canvas.',
			});
		}

		const data = await res.json();

		return Number(data.id);
	} catch (error) {
		console.log('Error while creating assignment in Canvas', error);
		return Promise.reject(error);
	}
};

export const postGrades = async (
	userId: number,
	courseId: number,
	assignmentId: number,
	grades: StudentGrade[]
): Promise<void> => {
	try {
		const token = await getToken(userId);

		await Promise.all(
			grades.map(async (grade: StudentGrade) => {
				const res = await fetch(
					`${process.env.CANVAS_URL}/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${grade.id}?` +
						querystring.encode({
							'submission[posted_grade]': grade.points,
						}),

					{
						method: 'PUT',
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (res.status != 200) {
					return Promise.reject({
						message: 'Error while posting grades to Canvas.',
					});
				}
			})
		);
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
};

interface StudentGrade {
	id: number;
	points: number;
}
