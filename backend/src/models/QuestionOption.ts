import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const QuestionOption: ModelDefined<
	QuestionlOptionAttributes,
	QuestionOptionCreationAttributes
> = sequelize.define('QuestionOption', {
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
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isAnswer: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});
