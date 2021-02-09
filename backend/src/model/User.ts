import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const User: ModelDefined<
	UserAttributes,
	UserCreationAttributes
> = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	refreshToken: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});