import AWS from 'aws-sdk';

const isCredentialsSet =
	process.env.DYNAMO_ACCESS_KEY_ID && process.env.DYNAMO_ACCESS_KEY_ID;

const credentials = {
	accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID || '',
	secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY || '',
};

export default new AWS.DynamoDB({
	endpoint: process.env.DYNAMO_HOST,
	region: process.env.DYNAMO_REGION || 'localhost',
	credentials: isCredentialsSet ? credentials : undefined,
});
