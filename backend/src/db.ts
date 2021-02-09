import {
	Folder,
	Poll,
	PollOption,
	PollQuestion,
	PollUserResponse,
	User,
	UserMobileSetting,
	UserWebSetting,
} from './model';

const init = async (): Promise<void> => {
	Folder.hasMany(Poll, { foreignKey: 'folderId' });
	Poll.belongsTo(Folder, { foreignKey: 'folderId' });

	Poll.hasMany(PollQuestion, { foreignKey: 'pollId' });
	PollQuestion.belongsTo(Poll, { foreignKey: 'pollId' });

	PollQuestion.hasMany(PollOption, { foreignKey: 'pollQuestionId' });
	PollOption.belongsTo(PollQuestion, { foreignKey: 'pollQuestionId' });

	PollQuestion.hasMany(PollUserResponse, { foreignKey: 'pollQuestionId' });
	PollUserResponse.belongsTo(PollQuestion, { foreignKey: 'pollQuestionId' });

	PollOption.hasMany(PollUserResponse, { foreignKey: 'pollUserResponseId' });
	PollUserResponse.belongsTo(PollOption, { foreignKey: 'pollUserResponseId' });

	User.hasMany(PollUserResponse, { foreignKey: 'userId' });
	PollUserResponse.belongsTo(User, { foreignKey: 'userId' });

	User.hasOne(UserWebSetting, { foreignKey: 'userId' });
	UserWebSetting.belongsTo(User, { foreignKey: 'userId' });

	User.hasOne(UserMobileSetting, { foreignKey: 'userId' });
	UserMobileSetting.belongsTo(User, { foreignKey: 'userId' });

	try {
		await User.sync({ alter: true });
		await Folder.sync({ alter: true });
		await Poll.sync({ alter: true });
		await PollQuestion.sync({ alter: true });
		await PollOption.sync({ alter: true });
		await PollUserResponse.sync({ alter: true });
		await UserMobileSetting.sync({ alter: true });
		await UserWebSetting.sync({ alter: true });

		console.log('Database tables created');
		process.exit(0);
	} catch (error) {
		console.log('Fail to create tables', error);
		process.exit(1);
	}
};

export { init };
