import env from '../../.env.json';

const memo: Memo = {
	ws: null,
	cb: new Map(),
};

export function init() {
	// dont re-init WS
	if (memo.ws === null) {
		memo.ws = new WebSocket(env.WS_SERVER_URL);

		memo.ws.onopen = () => {
			// connection opened
			console.log('ws', 'open');
		};

		memo.ws.onmessage = (e) => {
			console.log('ws msg', e.data);
			// a message was received
			const payload = JSON.parse(e.data);
			const cb = memo.cb.get(payload.action);
			if (cb) {
				cb(payload);
			}
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

export function on(action: string, callback: WebSocketMessageEventCallback) {
	if (!memo.cb.has(action)) {
		memo.cb.set(action, callback);
	}
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

function format(payload: WSPayload): string {
	return JSON.stringify(payload);
}
