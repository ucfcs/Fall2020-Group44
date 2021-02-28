import { promisify } from 'util';

import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';
import { Sequelize } from 'sequelize';
import redis from 'redis';

// init redis connection
const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: 6379,
});

// init db connection
const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE as string,
	process.env.MYSQL_USER as string,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: 'mysql',
	}
);

// declare lambda function
export const hello = async (
	event: APIGatewayEvent,
	context: Context
): Promise<ProxyResult> => {
	const getAsync = promisify(client.get).bind(client);
	const setAsync = promisify(client.set).bind(client);

	client.on('error', (e) => console.error(e));
	client.on('ready', () => console.log('>> ready'));

	try {
		// Test the db connection and creds
		await sequelize.authenticate();

		console.log(await getAsync('key'));
		console.log(await setAsync('key', 'value'));
		console.log(await getAsync('key'));

		// Use this code if you don't use the http event with the LAMBDA-PROXY integration
		// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
		return {
			statusCode: 200,
			body: JSON.stringify(
				{
					message: 'Go Serverless v1.0! Your function executed successfully!',
					event,
					context,
				},
				null,
				2
			),
		};
	} catch (error) {
		console.error(error);

		return {
			statusCode: 500,
			body: JSON.stringify(error, null, 2),
		};
	}
};
