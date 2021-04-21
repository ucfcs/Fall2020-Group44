import { DataTypes, ModelDefined } from 'sequelize';

import sequelize from '../config/mysql';

export const Session: ModelDefined<
	SessionAttributes,
	SessionCreationAttributes
> = sequelize.define('Session', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	courseId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
