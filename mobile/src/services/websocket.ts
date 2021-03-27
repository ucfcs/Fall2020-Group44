import env from '../../.env.json';

let ws: WebSocket | null = null;

export function init() {
	ws = new WebSocket(env.WS_SERVER_URL);

	ws.onopen = () => {
		// connection opened
		// console.log('ws', 'open');
	};

	ws.onmessage = (e) => {
		// a message was received
		// console.log('ws  msg', e.data);
	};

	ws.onerror = (e) => {
		// an error occurred
		// console.log('ws err', e.message);
	};

	ws.onclose = (e) => {
		// connection closed
		// console.log('ws close', e.code, e.reason);
	};
}

export function join(roomKey: string) {
	if (ws) {
		ws.send(
			format({
				action: 'join',
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

type WSPayload =
	| {
			action: 'join';
			courseId: string;
	  }
	| {
			action: 'submit';
			optionId: number;
			ucfid: string;
	  }
	| {
			action: 'createRoom';
			courseId: string;
	  }
	| {
			action: 'closeRoom';
			courseId: string;
	  }
	| {
			action: 'startQuestion';
			courseId: string;
			question: object;
	  }
	| {
			action: 'endQuestion';
			courseId: string;
	  };
