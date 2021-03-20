import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const Folder: ModelDefined<
	FolderAttributes,
	FolderCreationAttributes
> = sequelize.define(
	'Folder',
	{
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
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['name', 'courseId'],
			},
		],
	}
);
