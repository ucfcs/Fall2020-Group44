import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/mysql';

export const SessionGrade: ModelDefined<
	SessionGradeAttributes,
	SessionGradeCreationAttributes
> = sequelize.define(
	'sessionGrade',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sessionId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		points: {
			type: DataTypes.DOUBLE,
			allowNull: true,
		},
		maxPoints: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['userId', 'sessionId'],
			},
		],
	}
);
