import env from '../../.env.json';

const memo: Memo = {
	ws: null,
	cb: new Map<OnAction, OnCallback[]>(),
};

export function init() {
	// dont re-init WS
	if (memo.ws === null) {
		memo.ws = new WebSocket(env.WS_SERVER_URL);

		memo.ws.onmessage = (event) => {
			const data: any = JSON.parse(event.data);
			const cbs = memo.cb.get(data.action);

			if (Array.isArray(cbs)) {
				cbs.forEach((cb) => cb(data));
			}
		};
	}
}

export function add(action: OnAction, callback: OnCallback) {
	const cbs = memo.cb.get(action) || [];

	cbs.push(callback);

	if (!memo.cb.has(action)) {
		memo.cb.set(action, cbs);
	}
}

export function remove(action: OnAction, callback: OnCallback) {
	const cbs = memo.cb.get(action);

	if (Array.isArray(cbs)) {
		memo.cb.set(
			action,
			cbs.filter((f) => f !== callback),
		);
	}
}

export function emit(payload: EmitPayload) {
	if (memo.ws) {
		memo.ws.send(format(payload));
	}
}

export function join(roomKey: string) {
	if (memo.ws) {
		emit({
			action: 'studentJoinRoom',
			courseId: roomKey,
		});
	}
}

//
// Util
//

function format(payload: EmitPayload): string {
	return JSON.stringify(payload);
}
