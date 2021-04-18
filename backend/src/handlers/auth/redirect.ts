import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import responses from '../../util/api/responses';
import { userAuthFlowGetToken } from '../../util/auth';
import { Lti } from '../../models';

const webRedirect = async (code: string) => {
	try {
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
				code: code,
			}),
		});

		const data: CanvasOAuthResponses = await res.json();

		// Generate token and retrive LTI data
		const [token, LtiData] = await Promise.all([
			userAuthFlowGetToken(data.user.id, data.access_token, data.refresh_token),
			Lti.findOne({
				where: {
					canvasUserId: data.user.id,
				},
			}),
		]);

		const courseId = LtiData?.get().canvasCourseId;
		LtiData?.destroy();

		return responses.movedPermanently(
			`${process.env.FRONTEND_URL}/course/${courseId}?token=${token}`
		);
	} catch (error) {
		console.error('Error while fetching:', error);
		return responses.internalServerError(error);
	}
};

const mobileRedirect = async (code: string) => {
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
				code: code,
			}),
		});
		const data: CanvasOAuthResponses = await res.json();

		const token = await userAuthFlowGetToken(
			data.user.id,
			data.access_token,
			data.refresh_token
		);

		return responses.movedPermanently(
			`ucf-react://authentication?token=${token}`
		);
	} catch (error) {
		console.error(error);
		return responses.internalServerError(error);
	}
};

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayEvent
) => {
	const { queryStringParameters } = event;
	console.log(queryStringParameters);

	if (!queryStringParameters || !queryStringParameters.code) {
		return responses.badRequest();
	}

	if (queryStringParameters.state == 'web') {
		return webRedirect(queryStringParameters.code);
	} else if (queryStringParameters.state == 'mobile') {
		return mobileRedirect(queryStringParameters.code);
	} else {
		return responses.badRequest();
	}
};
