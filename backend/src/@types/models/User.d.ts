type UserId = number;

interface UserAttributes {
	canvasId: number;
	token: string;
	refreshToken: string;
	tokenExpireTime: number;
}

interface UserCreationAttributes {
	canvasId: number;
	token?: string;
	refreshToken?: string;
	tokenExpireTime?: number;
}
