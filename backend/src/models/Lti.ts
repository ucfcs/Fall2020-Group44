import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const Lti: ModelDefined<
	LtiAttributes,
	LtiCreationAttributes
> = sequelize.define(
	'Lti',
	{
		canvasUserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		canvasCourseId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: 'Lti',
		timestamps: false,
	}
);
