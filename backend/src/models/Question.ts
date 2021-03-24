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
	courseId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	question: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	participationPoints: {
		type: DataTypes.DOUBLE,
		allowNull: false,
		defaultValue: 0.5,
	},
	correctnessPoints: {
		type: DataTypes.DOUBLE,
		allowNull: false,
		defaultValue: 0.5,
	},
});
