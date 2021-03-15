import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const Course: ModelDefined<
	CourseAttributes,
	CourseCreationAttributes
> = sequelize.define('Course', {
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
	canvasCourseId: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});
