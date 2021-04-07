import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const QuestionGrade: ModelDefined<
	QuestionGradeAttributes,
	QuestionGradeCreationAttributes
> = sequelize.define(
	'QuestionGrade',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		courseId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sessionGradeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		questionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		points: {
			type: DataTypes.DOUBLE,
			allowNull: true,
		},
		maxPoints: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['userId', 'sessionGradeId', 'questionId'],
			},
		],
	}
);
