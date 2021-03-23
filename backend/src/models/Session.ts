import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const Session: ModelDefined<
	SessionAttributes,
	SessionCreationAttributes
> = sequelize.define('session', {
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
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	courseId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
