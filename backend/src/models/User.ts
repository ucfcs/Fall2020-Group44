import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

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
	canvasId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	refreshToken: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
