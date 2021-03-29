interface Memo {
	ws: WebSocket | null;
	cb: Map<string, Callback>;
}

type EmitPayload =
	| {
			action: 'studentJoinRoom';
			courseId: string;
	  }
	| {
			action: 'leaveRoom';
			courseId: string;
	  }
	| {
			action: 'submit';
			courseId: string;
			questionId: string;
			optionId: string;
			ucfid: string;
			sessionId: string;
	  }
	| {
			action: 'joinSession';
			courseId: string;
	  }
	| {
			action: 'leaveSession';
			courseId: string;
	  };

type OnStartSessionCallback = (data: {
	action: 'startSession';
	payload: { name: string; id: number };
}) => void;

type OnEndSessionCallback = () => void;

type OnStartQuestionCallback = (data: {
	action: 'startQuestion';
	payload: { question: Question };
}) => void;

type OnEndQuestionCallback = () => void;

//
// handle inbound events callbacks
//
type Callback =
	| OnStartSessionCallback
	| OnEndSessionCallback
	| OnStartQuestionCallback
	| OnEndQuestionCallback;
