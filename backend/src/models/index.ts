import { Folder } from './Folder';
import { Session } from './Session';
import { SessionQuestion } from './SessionQuestion';
import { SessionGrade } from './SessionGrade';
import { Question } from './Question';
import { QuestionGrade } from './QuestionGrade';
import { QuestionOption } from './QuestionOption';
import { QuestionUserResponse } from './QuestionUserResponse';
import { User } from './User';
import { UserSetting } from './UserSetting';

// one-to-many relationship between Folder and Question
Folder.hasMany(Question, { foreignKey: 'folderId' });
Question.belongsTo(Folder, {
	as: 'questions',
	constraints: false,
	foreignKey: 'folderId',
});

// many-to-many relationship between Session and Question
Question.belongsToMany(Session, {
	through: SessionQuestion,
	foreignKey: 'questionId',
});
Session.belongsToMany(Question, {
	through: SessionQuestion,
	foreignKey: 'sessionId',
});

// one-to-many relationship between Question and QuestionOption
Question.hasMany(QuestionOption, { foreignKey: 'questionId' });
QuestionOption.belongsTo(Question, {
	as: 'QuestionOptions',
	foreignKey: 'questionId',
});

// one-to-many relationship between Question and QuestionUserResponse
Question.hasMany(QuestionUserResponse, { foreignKey: 'questionId' });
QuestionUserResponse.belongsTo(Question, { foreignKey: 'questionId' });

// one-to-many relationship between Question and QuestionOption
QuestionOption.hasMany(QuestionUserResponse, {
	foreignKey: 'questionUserResponseId',
});
QuestionUserResponse.belongsTo(QuestionOption, {
	foreignKey: 'questionUserResponseId',
});

// one-to-many relationship between User and QuestionUserResponse
User.hasMany(QuestionUserResponse, { foreignKey: 'userId' });
QuestionUserResponse.belongsTo(User, { foreignKey: 'userId' });

// one-to-many relationship between User and UserSetting
User.hasMany(UserSetting, { foreignKey: 'id' });
UserSetting.belongsTo(User, { foreignKey: 'userId' });

// one-to-many relationship between Session and SessionGrade
Session.hasMany(SessionGrade, { foreignKey: 'sessionId' });
SessionGrade.belongsTo(Session, { foreignKey: 'sessionId' });

// one-to-many relationship between User and SessionGrade
User.hasMany(SessionGrade, {
	foreignKey: 'userId',
});
SessionGrade.belongsTo(User, {
	foreignKey: 'userId',
});

// one-to-many relationship between User and QuestionGrade
User.hasMany(QuestionGrade, {
	foreignKey: 'userId',
});
QuestionGrade.belongsTo(User, {
	foreignKey: 'userId',
});

export {
	Folder,
	Session,
	SessionGrade,
	SessionQuestion,
	Question,
	QuestionGrade,
	QuestionOption,
	QuestionUserResponse,
	User,
	UserSetting,
};
