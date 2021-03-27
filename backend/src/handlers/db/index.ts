import 'colors';

import * as mysql from './mysql';
import * as dynamo from './dynamo';

export async function init(): Promise<void> {
	await mysql.init();
	await dynamo.init();
}

export async function drop(): Promise<void> {
	await mysql.drop();
	await dynamo.drop();
}
