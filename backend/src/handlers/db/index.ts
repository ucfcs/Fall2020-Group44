import 'colors';

import * as mysql from './mysql';
import * as dynamo from './dynamo';

const lastArg = process.argv.pop();
const isOnlyMySQL = lastArg === '--only-mysql';
const isOnlyDynamo = lastArg === '--only-dynamo';

export async function init(): Promise<void> {
	if (!isOnlyDynamo) await mysql.init();
	if (!isOnlyMySQL) await dynamo.init();
}

export async function drop(): Promise<void> {
	if (!isOnlyDynamo) await mysql.drop();
	if (!isOnlyMySQL) await dynamo.drop();
}
