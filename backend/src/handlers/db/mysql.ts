import {
	Folder,
	Session,
	Session_Question,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserSetting,
} from '../../models';
import { ERROR, LOG } from '../../util/logs';

export async function init(): Promise<void> {
	try {
		await User.sync({ alter: true });
		await Folder.sync({ alter: true });
		await Session.sync({ alter: true });
		await Question.sync({ alter: true });
		await Session_Question.sync({ alter: true });
		await QuestionOption.sync({ alter: true });
		await QuestionUserResponse.sync({ alter: true });
		await UserSetting.sync({ alter: true });
		LOG('mysql🐬 init successful'.green);
	} catch (error) {
		ERROR(error);
	}
}

export async function drop(): Promise<void> {
	try {
		await UserSetting.drop();
		await Session_Question.drop();
		await QuestionUserResponse.drop();
		await QuestionOption.drop();
		await Question.drop();
		await Session.drop();
		await Folder.drop();
		await User.drop();
		LOG('mysql🐬 drop successful'.green);
	} catch (error) {
		ERROR(error);
	}
}
