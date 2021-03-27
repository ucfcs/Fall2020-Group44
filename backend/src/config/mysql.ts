import { Sequelize } from 'sequelize';

export default new Sequelize(
	process.env.MYSQL_DATABASE as string,
	process.env.MYSQL_USER as string,
	process.env.MYSQL_ROOT_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: 'mysql',
	}
);
