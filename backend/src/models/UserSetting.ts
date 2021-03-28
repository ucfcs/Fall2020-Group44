import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const UserSetting: ModelDefined<
	UserSettingAttributes,
	UserSettingCreationAttributes
> = sequelize.define('UserSetting', {
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
	platform: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
