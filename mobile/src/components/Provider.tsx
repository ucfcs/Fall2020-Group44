import React, { FunctionComponent, useReducer } from 'react';

const intialState: AppState = {
	name: '',
	email: '',
	token: '',
	//
	settings: {},
	//
	phase: 'isolated',
	ws: null,
	url: '',
};

function reducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'CONNECT':
			const ws = new WebSocket('http://localhost:3001');

			ws.onopen = () => {
				// connection opened
				ws.send('something'); // send a message
			};

			ws.onmessage = (e) => {
				// a message was received
				// console.log(e.data);
			};

			ws.onerror = (e) => {
				// an error occurred
				// console.log(e.message);
			};

			ws.onclose = (e) => {
				// connection closed
				// console.log(e.code, e.reason);
			};

			state.ws = ws;
			state.phase = 'connected';
			break;
		case 'SET_URL':
			state.url = action.payload;
			break;
		case 'AUTHENTICATED':
			state.phase = 'authenticated';
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
