type UserSettingId = number;
type Platform = 'mobile' | 'web';

interface UserSettingAttributes {
	id: UserSettingId;
	document: string;
	platform: Platform;
	userId: UserId;
}

interface UserSettingCreationAttributes {
	document: string;
	platform: Platform;
	userId: UserId;
}
