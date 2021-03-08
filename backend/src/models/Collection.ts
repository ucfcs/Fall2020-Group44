import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../config/database';

export const Collection: ModelDefined<
	CollectionAttributes,
	CollectionCreationAttributes
> = sequelize.define(
	'Collection',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		folderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		courseId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		publishedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['name', 'userId', 'folderId'],
			},
		],
	}
);
