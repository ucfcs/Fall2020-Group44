import {
	APIGatewayEvent,
	APIGatewayProxyHandler,
	ProxyResult,
} from 'aws-lambda';
import uuid from 'uuid';
import response from '../../util/api/responses';
import querystring from 'querystring';
import { userAuthFlowGetToken } from '../../util/auth';

/**
 * @see http://localhost:3000/dev/api/v1/auth/lti
 */
export const launch: APIGatewayProxyHandler = async (
	event: APIGatewayEvent
) => {
	// do we have a user with that info
	console.log(querystring.parse(event.body as string));

	return response.movedPermanently(process.env.SITE_BASE_URL as string);
};

/**
 *
 * LTI Launch: https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html
 *
 */

// Step 2: Authentication Request
export const login = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nlogin');

	const state = uuid.v4();
	const nonce = uuid.v4();

	const body = querystring.parse(event.body as string);

	const url =
		`${process.env.CANVAS_URL}/api/lti/authorize_redirect?` +
		querystring.encode({
			response_type: 'id_token',
			scipe: 'openid',
			login_hint: body.login_hint,
			lti_message_hint: body.lti_message_hint,
			state: state,
			redirect_uri: process.env.LTI_REDIRECT_URL,
			nonce: nonce,
			prompt: 'none',
			response_mode: 'form_post',
		});

	console.log('LTI JWT login init; redirecting to:', url);

	return response.movedPermanently(url);
};

// Step 4: Resource Display
export const lti13 = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nlti13');

	const body = querystring.parse(event.body as string);

	// Parse and store payload data from launch
	const id_token = body.id_token as string;
	const parts = id_token.split('.');
	const tokenBody = JSON.parse(Buffer.from(parts[1], 'base64').toString());

	const courseData =
		tokenBody['https://purl.imsglobal.org/spec/lti/claim/custom'];

	const token = await userAuthFlowGetToken(courseData.userid, '', '');

	return response.movedPermanently(
		`${process.env.SITE_BASE_URL}/course/${courseData.courseid}?token=${token}` as string
	);
};
