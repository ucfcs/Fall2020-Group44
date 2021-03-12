import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const Question: ModelDefined<
	QuestionAttributes,
	QuestionCreationAttributes
> = sequelize.define('Question', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	folderId: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	question: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	timeToAnswer: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});
