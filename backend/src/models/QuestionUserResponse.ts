import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const QuestionUserResponse: ModelDefined<
	QuestionUserResponseAttributes,
	QuestionUserResponseCreationAttributes
> = sequelize.define(
	'QuestionUserResponse',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		questionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		questionOptionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['userId', 'questionId', 'questionOptionId'],
			},
		],
	}
);
