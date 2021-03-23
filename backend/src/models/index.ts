import { Folder } from './Folder';
import { Session } from './Session';
import { Session_Question } from './SessionQuestion';
import { QuestionOption } from './QuestionOption';
import { Question } from './Question';
import { QuestionUserResponse } from './QuestionUserResponse';
import { User } from './User';
import { UserMobileSetting } from './UserMobileSetting';
import { UserWebSetting } from './UserWebSetting';

Folder.hasMany(Question, { foreignKey: 'folderId' });
Question.belongsTo(Folder, {
	as: 'questions',
	constraints: false,
	foreignKey: 'folderId',
});

Question.belongsToMany(Session, {
	through: Session_Question,
	foreignKey: 'questionId',
});
Session.belongsToMany(Question, {
	through: Session_Question,
	foreignKey: 'sessionId',
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

User.hasOne(UserWebSetting, { foreignKey: 'userId' });
UserWebSetting.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserMobileSetting, { foreignKey: 'userId' });
UserMobileSetting.belongsTo(User, { foreignKey: 'userId' });

export {
	Folder,
	Session,
	Session_Question,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserMobileSetting,
	UserWebSetting,
};
