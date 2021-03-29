interface AppState {
	name: string;
	email: string;
	token: string;
	//
	settings: Settings;
	//
	session: Session | null;
	question: Question | null;
	//
	phase: Phase;
}

interface AppContext {
	state: AppState;
	dispatch: React.Dispatch<Action>;
}

interface Settings {
	[key: string]: string | boolean | number;
}

interface Session {
	id: number;
	name: string;
}

interface Question {
	id: string;
}

type Phase = 'initializing' | 'authentication' | 'connection';

type Action =
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }
	| { type: 'SET_TOKEN'; payload: string }
	| { type: 'SET_PHASE'; payload: Phase }
	//
	| { type: 'SET_SETTING'; payload: Settings }
	| { type: 'SET_SETTING_PUSHNOTIFICATION' }
	//
	| { type: 'SET_SESSION'; payload: Session | null }
	//
	| { type: 'END' };
