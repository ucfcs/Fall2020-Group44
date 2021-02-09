import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const PollQuestion: ModelDefined<
	PollQuestionAttributes,
	PollQuestionCreationAttributes
> = sequelize.define('PollQuestion', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	pollId: {
		type: DataTypes.INTEGER,
		allowNull: false,
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
