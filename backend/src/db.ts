import {
	Folder,
	Collection,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserMobileSetting,
	UserWebSetting,
} from './models';

const init = async (): Promise<void> => {
	Folder.hasMany(Collection, { foreignKey: 'folderId' });
	Collection.belongsTo(Folder, { foreignKey: 'folderId' });

	Collection.hasMany(Question, { foreignKey: 'collectionId' });
	Question.belongsTo(Collection, { foreignKey: 'collectionId' });

	Question.hasMany(QuestionOption, { foreignKey: 'questionId' });
	QuestionOption.belongsTo(Question, { foreignKey: 'questionId' });

	Question.hasMany(QuestionUserResponse, { foreignKey: 'questionId' });
	QuestionUserResponse.belongsTo(Question, { foreignKey: 'questionId' });

	QuestionOption.hasMany(QuestionUserResponse, {
		foreignKey: 'questionUserResponseId',
	});
	QuestionUserResponse.belongsTo(QuestionOption, {
		foreignKey: 'questionUserResponseId',
	});

	User.hasMany(QuestionUserResponse, { foreignKey: 'userId' });
	QuestionUserResponse.belongsTo(User, { foreignKey: 'userId' });

	User.hasOne(UserWebSetting, { foreignKey: 'userId' });
	UserWebSetting.belongsTo(User, { foreignKey: 'userId' });

	User.hasOne(UserMobileSetting, { foreignKey: 'userId' });
	UserMobileSetting.belongsTo(User, { foreignKey: 'userId' });

	try {
		await User.sync({ alter: true });
		await Folder.sync({ alter: true });
		await Collection.sync({ alter: true });
		await Question.sync({ alter: true });
		await QuestionOption.sync({ alter: true });
		await QuestionUserResponse.sync({ alter: true });
		await UserMobileSetting.sync({ alter: true });
		await UserWebSetting.sync({ alter: true });

		await User.create({
			firstName: 'Mock',
			lastName: 'Last',
			token: null,
			refreshToken: null,
		});
		await Folder.create({ name: 'First Folder', userId: 1, courseId: '1' });
		await Collection.create({
			name: 'Collection 1',
			userId: 1,
			folderId: 1,
			courseId: '1',
			publishedAt: null,
		});
		await Question.create({
			question: 'Q1',
			collectionId: 1,
			timeToAnswer: null,
		});
		await QuestionOption.create({
			text: 'Option 1',
			questionId: 1,
			isAnswer: false,
		});

		console.log('Database tables created');
		process.exit(0);
	} catch (error) {
		console.log('Fail to create tables', error);
		process.exit(1);
	}
};

const drop = async (): Promise<void> => {
	try {
		await UserWebSetting.drop();
		await UserMobileSetting.drop();
		await QuestionUserResponse.drop();
		await QuestionOption.drop();
		await Question.drop();
		await Collection.drop();
		await Folder.drop();
		await User.drop();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export { init, drop };
