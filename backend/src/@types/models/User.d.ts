type UserId = number;

interface UserAttributes {
	canvasId: number;
	token: string;
	refreshToken: string;
	tokenExpireTime: number;
	public readonly SessionGrades?: SessionGrades[];
	public readonly QuestionGrades?: QuestionGrades[];
}

interface UserCreationAttributes {
	canvasId: number;
	token?: string;
	refreshToken?: string;
	tokenExpireTime?: number;
}
