import {
	APIGatewayTokenAuthorizerEvent,
	Context,
	Callback,
	PolicyDocument,
} from 'aws-lambda';
import { decode } from '../../util/token';

export const tokenAuthorizer = async (
	event: APIGatewayTokenAuthorizerEvent,
	_context: Context,
	callback: Callback
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
	if (!event.authorizationToken) {
		return callback(null, {
			principalId: 'user',
			policyDocument: getPolicyDocument('Deny', event.methodArn),
		});
	}

	try {
		const token = event.authorizationToken.split(' ')[1];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const user: any = decode(token);

		// Invalid token, reject request
		if (!user) {
			return callback(null, {
				principalId: 'user',
				policyDocument: getPolicyDocument('Deny', event.methodArn),
			});
		}

		// Valid token, forward to request
		callback(null, {
			principalId: user.canvasId,
			policyDocument: getPolicyDocument('Allow', event.methodArn),
			context: user,
		});
	} catch (error) {
		return callback(null, {
			principalId: 'user',
			policyDocument: getPolicyDocument('Deny', event.methodArn),
		});
	}
};

const getPolicyDocument = (
	effect: string,
	resource: string
): PolicyDocument => {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: effect,
				Resource: resource,
			},
		],
	};
};
