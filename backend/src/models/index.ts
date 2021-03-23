import { Folder } from './Folder';
import { Collection } from './Collection';
import { QuestionOption } from './QuestionOption';
import { Question } from './Question';
import { QuestionUserResponse } from './QuestionUserResponse';
import { User } from './User';
import { UserSetting } from './UserSetting';

Folder.hasMany(Question, { foreignKey: 'folderId' });
Question.belongsTo(Folder, {
	as: 'questions',
	constraints: false,
	foreignKey: 'folderId',
});

Question.hasMany(QuestionOption, { foreignKey: 'questionId' });
QuestionOption.belongsTo(Question, {
	as: 'QuestionOptions',
	foreignKey: 'questionId',
});

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

User.hasMany(UserSetting, { foreignKey: 'id' });
UserSetting.belongsTo(User, { foreignKey: 'userId' });

export {
	Folder,
	Collection,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserSetting,
};
