type UserId = number;

interface UserAttributes {
	id: UserId;
	canvasId: number;
	token: string | null;
	refreshToken: string | null;
}

interface UserCreationAttributes {
	canvasId: number;
	token?: string | null;
	refreshToken?: string | null;
}
