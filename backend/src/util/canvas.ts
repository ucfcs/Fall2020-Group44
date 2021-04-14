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

		const data = await res.json();

		return Number(data.id);
	} catch (error) {
		console.log('Error while creating assignment:', error);
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
			grades.map(async (grade) => {
				await fetch(
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
			})
		);
	} catch (error) {
		console.log('Error while posting grade:', error);
		return Promise.reject(error);
	}
};

interface StudentGrade {
	id: number;
	points: number;
}
