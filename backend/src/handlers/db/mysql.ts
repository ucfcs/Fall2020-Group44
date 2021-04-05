import {
	Folder,
	Session,
	SessionGrade,
	SessionQuestion,
	QuestionOption,
	Question,
	QuestionUserResponse,
	QuestionGrade,
	User,
	UserSetting,
} from '../../models';
import { ERROR, LOG } from '../../util/logs';

export async function init(): Promise<void> {
	try {
		for (let i = 0; i < models.length; i++) {
			await models[i].sync({ alter: true });
		}
		LOG('mysql🐬 init successful'.green);
	} catch (error) {
		ERROR(error);
	}
}

export async function drop(): Promise<void> {
	try {
		for (let i = models.length - 1; i >= 0; i--) {
			await models[i].drop({ cascade: true });
		}
		LOG('mysql🐬 drop successful'.green);
	} catch (error) {
		ERROR(error);
	}
}
