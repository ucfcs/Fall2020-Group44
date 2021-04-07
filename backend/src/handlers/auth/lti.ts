import {
	APIGatewayEvent,
	APIGatewayProxyHandler,
	ProxyResult,
} from 'aws-lambda';
import uuid from 'uuid';
import fetch from 'node-fetch';
import response from '../../util/api/responses';
import querystring from 'querystring';
import { userAuthFlowGetToken } from '../../util/auth';
import { User } from '../../models';
import { encode } from '../../util/token';

/**
 * @see http://localhost:3000/dev/api/v1/auth/lti
 */
export const launch: APIGatewayProxyHandler = async (
	event: APIGatewayEvent
) => {
	const body = querystring.decode(event.body as string);

	const courseId = body.custom_canvas_course_id;
	const userId = body.custom_canvas_user_id;

	console.log('courseId', courseId);
	console.log('userId', userId);

	const user = await User.findOne({
		where: {
			canvasId: userId,
		},
	});

	// User does not exist
	if (!user) {
		const url =
			`${process.env.CANVAS_URL}/login/oauth2/auth?` +
			querystring.encode({
				client_id: process.env.CANVAS_ID,
				response_type: 'code',
				redirect_uri: process.env.CANVAS_REDIRECT,
				state: 1,
				scope: 'url:POST|/api/v1/courses/:course_id/assignments',
			});

		return response.movedPermanently(url);
	}

	const token = encode(user.get());

	return response.movedPermanently(
		`${process.env.SITE_BASE_URL}?token=${token}` as string
	);
};

export const redirect: APIGatewayProxyHandler = async (
	event: APIGatewayEvent
) => {
	const { queryStringParameters } = event;
	if (!queryStringParameters) {
		return response.badRequest({
			message: 'query string "code" is missing',
		});
	}

	try {
		// let us initiate the next step of the OAuth flow but sending the POST request with the auth code
		// see https://canvas.instructure.com/doc/api/file.oauth_endpoints.html#post-login-oauth2-token
		const res = await fetch(`${process.env.CANVAS_URL}/login/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.CANVAS_ID,
				client_secret: process.env.CANVAS_KEY,
				redirect_uri: process.env.CANVAS_REDIRECT,
				code: queryStringParameters.code,
			}),
		});

		const data: CanvasOAuthResponses = await res.json();

		const token = await userAuthFlowGetToken(
			data.user.id,
			data.access_token,
			data.refresh_token
		);

		return response.movedPermanently(
			`${process.env.SITE_BASE_URL}/course/${queryStringParameters.state}?token=${token}` as string
		);
	} catch (error) {
		console.error('Error while fetching:', error);
		return response.internalServerError(error);
	}
};

/**
 *
 * LTI Launch: https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html
 *
 */

// Step 2: Authentication Request
export const login = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nlogin');

	try {
		const body = querystring.parse(event.body as string);

		if (!body.login_hint) {
			return response.badRequest();
		}

		const state = uuid.v4();
		const nonce = uuid.v4();

		const url =
			`${process.env.CANVAS_URL}/api/lti/authorize_redirect?` +
			querystring.encode({
				response_type: 'id_token',
				scope: 'openid',
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
	} catch (error) {
		return response.internalServerError(error);
	}
};

// Step 4: Resource Display
export const lti13 = async (event: APIGatewayEvent): Promise<ProxyResult> => {
	console.log('--------------------\nlti13');

	try {
		const body = querystring.parse(event.body as string);

		if (!body.id_token) {
			return response.badRequest();
		}

		// Parse and store payload data from launch
		const id_token = body.id_token as string;
		const parts = id_token.split('.');
		const tokenBody = JSON.parse(Buffer.from(parts[1], 'base64').toString());

		const courseData =
			tokenBody['https://purl.imsglobal.org/spec/lti/claim/custom'];

		const token = await userAuthFlowGetToken(courseData.userid, '', '');

		// Redirect to course page
		return response.movedPermanently(
			`${process.env.SITE_BASE_URL}/course/${courseData.courseid}?token=${token}`
		);
	} catch (error) {
		return response.internalServerError();
	}
};
