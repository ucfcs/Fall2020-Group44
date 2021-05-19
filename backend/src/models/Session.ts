import { DataTypes, Model, HasManyRemoveAssociationsMixin } from 'sequelize';
import { Question } from './Question';

import sequelize from '../config/mysql';

export class Session
	extends Model<SessionAttributes, SessionCreationAttributes>
	implements SessionAttributes {
	public id!: number;
	public name!: string;
	public courseId!: string;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public removeQuestions!: HasManyRemoveAssociationsMixin<
		typeof Question,
		number
	>;
}

Session.init(
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
	{ sequelize }
);
