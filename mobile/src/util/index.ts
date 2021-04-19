export function toJSON<T = unknown>(res: Response): Promise<T> {
	return res.json();
}
