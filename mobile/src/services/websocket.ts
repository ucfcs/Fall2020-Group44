import env from '../../.env.json';

const memo: Memo = {
	ws: null,
	cb: new Map<OnAction, OnCallback>(),
};

export function init() {
	// dont re-init WS
	if (memo.ws === null) {
		memo.ws = new WebSocket(env.WS_SERVER_URL);

		memo.ws.onopen = () => {
			// connection opened
			console.log('ws', 'open');
		};

		memo.ws.onmessage = (event) => {
			const data: any = JSON.parse(event.data);
			const cb = memo.cb.get(data.action);
			if (cb) cb(data);
			console.log('ws msg', data);
		};

		memo.ws.onerror = (e) => {
			// an error occurred
			console.log('ws err', e.message);
		};

		memo.ws.onclose = (e) => {
			// connection closed
			console.log('ws close', e.code, e.reason);
		};
	}
}

export function on(action: OnAction, callback: OnCallback) {
	if (!memo.cb.has(action)) {
		memo.cb.set(action, callback);
	}
}

export function remove(action: OnAction) {
	memo.cb.delete(action);
}

export function join(roomKey: string) {
	if (memo.ws) {
		memo.ws.send(
			format({
				action: 'studentJoinRoom',
				courseId: roomKey,
			}),
		);
	}
}

//
// Util
//

function format(payload: EmitPayload): string {
	return JSON.stringify(payload);
}
