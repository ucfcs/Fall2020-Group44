type AppState = {
	name: string;
	email: string;
	token: string;
	//
	settings: Settings;
	//
	phase: Phase;
	ws: null | WebSocket;
	url: string;
};

type AppContext = {
	state: AppState;
	dispatch: React.Dispatch<Action>;
};

type Settings = {
	[key: string]: string;
};

type Phase = 'isolated' | 'connected' | 'authenticated';

type Action =
	| { type: 'CONNECT' }
	| { type: 'AUTHENTICATED' }
	| { type: 'SET_URL'; payload: string }
	| { type: 'SET_PHASE'; payload: Phase }
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }
	| { type: 'SET_TOKEN'; payload: string };
