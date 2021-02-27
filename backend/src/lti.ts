import { ProxyResult } from 'aws-lambda';
import response from './util/API_Responses';

const launch = async (): Promise<ProxyResult> => {
	return response._301(process.env.SITE_BASE_URL as string);
};

export { launch };
