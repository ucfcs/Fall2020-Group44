import AWS from 'aws-sdk';

export default new AWS.DynamoDB({
	region: process.env.DYNAMO_REGION,
	endpoint: process.env.DYNAMO_HOST,
	// credentials: {
	// 	accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID || '',
	// 	secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY || ''
	// }
});
