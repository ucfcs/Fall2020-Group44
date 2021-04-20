import { ERROR, LOG } from '../../util/logs';

// import the models with the relationships established
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
	Lti,
} from '../../models';

// model init order
const models = [
	User,
	Folder,
	Session,
	Question,
	SessionGrade,
	QuestionGrade,
	SessionQuestion,
	QuestionOption,
	QuestionUserResponse,
	UserSetting,
	Lti,
];

export async function init(): Promise<void> {
	try {
		for (let i = 0; i < models.length; i++) {
			await models[i].sync({ alter: true });
		}

		// ignore the fact that its the User model
		// each model has access to sequelize connection object
		// after pointing to said object we can run raw querys from this script
		await User.sequelize?.query(
			'SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""));'
		);

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
