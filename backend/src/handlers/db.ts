import {
	Folder,
	Collection,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserMobileSetting,
	UserWebSetting,
} from '../models';

const init = async (): Promise<void> => {
	try {
		await User.sync({ alter: true });
		await Folder.sync({ alter: true });
		await Collection.sync({ alter: true });
		await Question.sync({ alter: true });
		await QuestionOption.sync({ alter: true });
		await QuestionUserResponse.sync({ alter: true });
		await UserMobileSetting.sync({ alter: true });
		await UserWebSetting.sync({ alter: true });

		await Folder.create({ name: 'Folder 1', userId: 1, courseId: '1' });
		await Collection.create({
			name: 'Collection 1',
			userId: 1,
			folderId: 1,
			courseId: '1',
			publishedAt: null,
		});
		await Question.create({
			title: 'Q1',
			question: 'Q1',
			folderId: 1,
			courseId: '1',
			QuestionOptions: [],
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
