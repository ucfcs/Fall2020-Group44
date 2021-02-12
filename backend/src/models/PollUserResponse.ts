import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const PollUserResponse: ModelDefined<
	PollUserResponseAttributes,
	PollUserResponseCreationAttributes
> = sequelize.define(
	'PollUserResponse',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		pollId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		pollOptionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['userId', 'pollId', 'pollOptionId'],
			},
		],
	}
);
