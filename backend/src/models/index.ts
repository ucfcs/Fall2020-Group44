import { Course } from './Course';
import { Folder } from './Folder';
import { Collection } from './Collection';
import { QuestionOption } from './QuestionOption';
import { Question } from './Question';
import { QuestionUserResponse } from './QuestionUserResponse';
import { User } from './User';
import { UserMobileSetting } from './UserMobileSetting';
import { UserWebSetting } from './UserWebSetting';

Course.hasMany(Folder, { foreignKey: 'courseId' });
Folder.belongsTo(Course, {
	as: 'folders',
	constraints: false,
	foreignKey: 'courseId',
});

Folder.hasMany(Collection, { foreignKey: 'folderId' });
Collection.belongsTo(Folder, {
	as: 'collections',
	constraints: false,
	foreignKey: 'folderId',
});

Collection.hasMany(Question, {
	foreignKey: 'collectionId',
});
Question.belongsTo(Collection, {
	as: 'questions',
	constraints: false,
	foreignKey: 'collectionId',
});

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

export {
	Course,
	Folder,
	Collection,
	QuestionOption,
	Question,
	QuestionUserResponse,
	User,
	UserMobileSetting,
	UserWebSetting,
};
