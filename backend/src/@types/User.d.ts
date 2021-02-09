type UserId = number;

interface UserAttributes {
	id: UserId;
	firstName: string;
	lastName: string;
	token: string;
	refreshToken: string;
}

interface UserCreationAttributes {
	firstName: string;
	lastName: string;
	token: string;
	refreshToken: string;
}
