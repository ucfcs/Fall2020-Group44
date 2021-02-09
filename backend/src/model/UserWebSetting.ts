import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const UserWebSetting: ModelDefined<
	UserWebSettingAttributes,
	UserWebSettingCreationAttributes
> = sequelize.define('UserWebSetting', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	document: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});
