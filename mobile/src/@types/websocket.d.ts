interface Memo {
	ws: WebSocket | null;
	cb: Map<OnAction, OnCallback[]>;
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
			questionOptionId: string;
			userId: string;
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

type OnEndSessionCallback = (data: { action: 'endSession' }) => void;

type OnStartQuestionCallback = (data: {
	action: 'startQuestion';
	payload: Question;
}) => void;

type OnEndQuestionCallback = (data: { action: 'endQuestion' }) => void;

//
// handle inbound
//
type OnAction = 'startSession' | 'endSession' | 'startQuestion' | 'endQuestion';

type OnCallback =
	| OnStartSessionCallback
	| OnEndSessionCallback
	| OnStartQuestionCallback
	| OnEndQuestionCallback;
