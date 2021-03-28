import dynamodb from '../../config/dynamo';
import { LOG } from '../../util/logs';

export async function init(): Promise<void> {
	const params = {
		TableName: process.env.DYNAMO_TABLE_NAME || '',
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

	await dynamodb.createTable(params).promise();

	LOG('dynamo🍃 init successful'.green);
}

export async function drop(): Promise<void> {
	const params = {
		TableName: process.env.DYNAMO_TABLE_NAME || '',
	};

	await dynamodb.deleteTable(params).promise();

	LOG('dynamo🍃 drop successful'.green);
}
