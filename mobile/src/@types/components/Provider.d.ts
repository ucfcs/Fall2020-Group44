interface AppState {
	id: number;
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
	QuestionOptions: {
		createdAt: string;
		id: number;
		isAnswer: false;
		questionId: number;
		responseCount: number;
		text: string;
		updatedAt: string;
	}[];
	correctnessPoints: number;
	courseId: string;
	createdAt: string;
	folderId: null;
	isClosed: boolean;
	participationPoints: number;
	progress: number;
	question: string;
	responseCount: number;
	title: string;
	updatedAt: string;
}

type Phase = 'initializing' | 'authentication' | 'connection';

type Action =
	| { type: 'SET_ID'; payload: number }
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_EMAIL'; payload: string }
	| { type: 'SET_TOKEN'; payload: string }
	| { type: 'SET_PHASE'; payload: Phase }
	//
	| { type: 'SET_SETTING'; payload: Settings }
	| { type: 'SET_SETTING_PUSHNOTIFICATION' }
	//
	| { type: 'SET_SESSION'; payload: Session | null }
	| { type: 'SET_QUESTION'; payload: Question | null }
	//
	| { type: 'END' };
