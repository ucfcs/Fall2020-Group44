import AWS from 'aws-sdk';

import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const serviceConfigOptions: ServiceConfigurationOptions = {
	region: 'us-east-2',
	endpoint: 'http://localhost:8000',
};

const dynamodb = new AWS.DynamoDB(serviceConfigOptions);

const init = async (): Promise<void> => {
	const params = {
		TableName: 'Connections',
		AttributeDefinitions: [
			{
				AttributeName: 'courseId',
				AttributeType: 'S',
			},
			{
				AttributeName: 'professor',
				AttributeType: 'S',
			},
		],
		KeySchema: [
			{
				AttributeName: 'courseId',
				KeyType: 'HASH',
			},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 5,
			WriteCapacityUnits: 5,
		},
		GlobalSecondaryIndexes: [
			{
				IndexName: 'ProfessorIndex',
				KeySchema: [{ AttributeName: 'professor', KeyType: 'HASH' }],
				Projection: {
					ProjectionType: 'ALL',
				},
				ProvisionedThroughput: {
					ReadCapacityUnits: 5,
					WriteCapacityUnits: 5,
				},
			},
		],
	};

	dynamodb.createTable(params, (error, data) => {
		if (error) {
			console.log('Failed to create DynamoDB Table', JSON.stringify(error));
			process.exit(1);
		} else {
			console.log(
				'DynamoDB Table Created. Table Description: ',
				JSON.stringify(data)
			);
			process.exit(0);
		}
	});
};

const drop = async (): Promise<void> => {
	const params = {
		TableName: 'Connections',
	};

	dynamodb.deleteTable(params, (error, data) => {
		if (error) {
			console.log('Failed to delete DynamoDB Table', JSON.stringify(error));
			process.exit(1);
		} else {
			console.log(
				'DynamoDB Table Deleted. Table Description: ',
				JSON.stringify(data)
			);
			process.exit(0);
		}
	});
};

export { init, drop };
