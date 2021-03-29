type UserId = number;

interface UserAttributes {
	id: UserId;
	canvasId: number;
	token: string;
	refreshToken: string;
}

interface UserCreationAttributes {
	canvasId: number;
	token?: string;
	refreshToken?: string;
}
