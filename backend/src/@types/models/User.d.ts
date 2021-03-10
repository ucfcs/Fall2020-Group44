type UserId = number;

interface UserAttributes {
	id: UserId;
	canvasId: number;
	fullName: string | null;
	token: string | null;
	refreshToken: string | null;
}

interface UserCreationAttributes {
	canvasId: number;
	fullName?: string | null;
	token?: string | null;
	refreshToken?: string | null;
}
