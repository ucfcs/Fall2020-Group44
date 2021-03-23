type AppState = {
	name: string;
	email: string;
	token: string;
	//
	settings: Settings;
	//
	phase: Phase;
	ws: null | WebSocket;
};

type AppContext = {
	state: AppState;
	dispatch: React.Dispatch<Action>;
};

type Settings = {
	[key: string]: string;
};

type Phase = 'initializing' | 'authentication' | 'connection';

type Action =
	| { type: 'CONNECT' }
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }
	| { type: 'SET_TOKEN'; payload: string }
	| { type: 'SET_PHASE'; payload: Phase };
