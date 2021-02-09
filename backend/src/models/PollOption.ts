import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const PollOption: ModelDefined<
	PollOptionAttributes,
	PollOptionCreationAttributes
> = sequelize.define('PollOption', {
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
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isAnswer: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});
