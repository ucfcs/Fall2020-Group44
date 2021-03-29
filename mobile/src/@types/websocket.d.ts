interface Memo {
	ws: WebSocket | null;
	cb: Map<string, WebSocketMessageEventCallback>;
}

type WSPayload = {
	action: 'studentJoinRoom';
	courseId: string;
};

type WebSocketMessageEventCallback = (event: WebSocketMessageEvent) => void;
