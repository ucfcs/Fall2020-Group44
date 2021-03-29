import React, { FunctionComponent, useReducer } from 'react';

const intialState: AppState = {
	name: '',
	email: '',
	token: '',
	//
	settings: {},
	//
	session: null,
	question: null,
	//
	phase: 'initializing',
};

function reducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		//
		// SETTER'S
		//
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
			console.log(action.payload);
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
