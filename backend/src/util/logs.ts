export const LOG = (context: string): void =>
	console.log('[LOG]'.blue, context);

export const ERROR = (context: string): void =>
	console.log('[ERROR]'.red, context);
