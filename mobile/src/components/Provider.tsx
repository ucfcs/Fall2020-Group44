import React, { FunctionComponent, useReducer } from 'react';

const intialState: AppState = {
	id: 0,
	name: '',
	email: '',
	token: '',
	//
	settings: {},
	//
	session: null,
	question: null,
	questionIsLocked: false,
	//
	phase: 'initializing',
};

function reducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		//
		// SETTER'S
		//
		case 'SET_ID':
			state.id = action.payload;
			break;
		case 'SET_NAME':
			state.name = action.payload;
			break;
		case 'SET_EMAIL':
			state.email = action.payload;
			break;
		case 'SET_PHASE':
			state.phase = action.payload;
			break;
		case 'SET_TOKEN':
			state.token = action.payload;
			break;
		//
		case 'SET_SETTING':
			state.settings = action.payload;
			break;
		case 'SET_SETTING_PUSHNOTIFICATION':
			state.settings.enablePushNotification = !state.settings
				.enablePushNotification
				? true
				: false;
			break;
		//
		case 'SET_SESSION':
			state.session = action.payload;
			break;
		case 'SET_QUESTION':
			// if the same question is being set dont update state
			if (state.question?.id === action.payload?.id) return state;

			// otherwise lets update the whole state tree
			state.question = action.payload;
			break;
		//
		case 'LOCK_QUESTION':
			state.questionIsLocked = true;
			break;
		case 'UNLOCK_QUESTION':
			state.questionIsLocked = false;
			break;
	}

	return Object.assign({}, state);
}

export const AppContext = React.createContext<AppContext>({
	state: intialState,
	dispatch: () => null,
});

export const Provider: FunctionComponent = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, intialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};
