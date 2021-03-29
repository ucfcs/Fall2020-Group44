import {
	APIGatewayEvent,
	APIGatewayProxyHandler,
	ProxyResult,
} from 'aws-lambda';
import response from '../../util/api/responses';
import querystring from 'querystring';

/**
 * @see http://localhost:3000/dev/api/v1/auth/lti
 */
export const launch: APIGatewayProxyHandler = async () => {
	// do we have a user with that info

	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};

// https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html
// Step 1: Login Initiation
export const login = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nlogin');

	// TODO: generate v4 uuid;
	const state = 'f0e41f9d-dc90-471b-a651-636ae26df124';
	const nonce = '75fd1447-cd57-4423-bc3b-a11040b9adb9';

	const body = querystring.parse(event.body as string);
	console.log('body', body);

	const url =
		`${process.env.CANVAS_URL}/api/lti/authorize_redirect` +
		'?response_type=id_token' +
		'&scope=openid' +
		'&login_hint=' +
		body.login_hint +
		'&lti_message_hint=' +
		body.lti_message_hint +
		'&state=' +
		state +
		'&redirect_uri=' +
		encodeURIComponent(process.env.LTI_REDIRECT_URL as string) +
		'&client_id=' +
		process.env.CANVAS_LTI_CLIENT_ID +
		'&nonce=' +
		nonce +
		'&prompt=none' +
		'&response_mode=form_post' +
		'&output=embed';

	console.log('LTI JWT login init; redirecting to: ' + url);

	return response.movedPermanently(url);
};

// Step 4: Resource Display
export const lti13 = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nti13');

	const body = querystring.parse(event.body as string);
	console.log(body);
	// TODO: verify token

	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};
