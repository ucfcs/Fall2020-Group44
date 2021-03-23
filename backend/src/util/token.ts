/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import jwt from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encode(obj: any): string {
	return jwt.sign(obj, privateKey);
}

export function decode<T>(token: string): T | null {
	const result = jwt.verify(token, privateKey);

	if (!result) {
		return null;
	}

	return (result as unknown) as T;
}
