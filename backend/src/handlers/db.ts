import {
	Folder,
	Session,
	Session_Question,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserSetting,
} from '../models';

const init = async (): Promise<void> => {
	try {
		await User.sync({ alter: true });
		await Folder.sync({ alter: true });
		await Session.sync({ alter: true });
		await Question.sync({ alter: true });
		await Session_Question.sync({ alter: true });
		await QuestionOption.sync({ alter: true });
		await QuestionUserResponse.sync({ alter: true });
		await UserSetting.sync({ alter: true });

		await Folder.create({ name: 'Folder 1', courseId: '1' });
		await Session.create({
			name: 'Session 1',
			userId: 1,
			courseId: '1',
		});
		await Question.create({
			title: 'Q1',
			question: 'Q1',
			folderId: 1,
			courseId: '1',
			QuestionOptions: [],
		});
		await Question.create({
			title: 'Q2',
			question: 'Q2',
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
		await UserSetting.drop();
		await Session_Question.drop();
		await QuestionUserResponse.drop();
		await QuestionOption.drop();
		await Question.drop();
		await Session.drop();
		await Folder.drop();
		await User.drop();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export { init, drop };
