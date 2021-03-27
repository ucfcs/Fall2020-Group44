import sequelize from '../config/mysql';

// Many to many relationship between session and question
export const Session_Question = sequelize.define(
	'Session_Question',
	{},
	{ timestamps: false }
);
