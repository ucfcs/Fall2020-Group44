import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const User: ModelDefined<
	UserAttributes,
	UserCreationAttributes
> = sequelize.define('User', {
	canvasId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
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
