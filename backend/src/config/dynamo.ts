import AWS from 'aws-sdk';

export default new AWS.DynamoDB({
	region: process.env.DYNAMO_REGION,
	endpoint: process.env.DYNAMO_HOST,
});
