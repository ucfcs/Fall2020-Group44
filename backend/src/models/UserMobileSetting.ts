import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const UserMobileSetting: ModelDefined<
	UserMobileSettingAttributes,
	UserMobileSettingCreationAttributes
> = sequelize.define('UserMobileSetting', {
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
