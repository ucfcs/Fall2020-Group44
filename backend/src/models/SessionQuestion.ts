import { DataTypes, ModelDefined } from 'sequelize';

import sequelize from '../config/mysql';

// Many to many relationship between session and question
export const SessionQuestion: ModelDefined<
	SessionQuestionAttributes,
	SessionQuestionCreationAttributes
> = sequelize.define(
	'SessionQuestion',
	{
		questionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sessionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ timestamps: false }
);
