import React, { FunctionComponent } from 'react';
import { StatusBar } from 'react-native';

import { Splash } from './components/Splash';
import { Login } from './components/Login';
import { Router } from './components/Router';
import { AppContext, Provider } from './components/Provider';

const App: FunctionComponent = () => {
	return (
		<Provider>
			<StatusBar barStyle='dark-content' />
			<AppContext.Consumer>
				{({ state }) => {
					switch (state.phase) {
						case 'initializing':
							return <Splash />;
						case 'authentication':
							return <Login />;
						case 'connection':
							return <Router />;
					}
				}}
			</AppContext.Consumer>
		</Provider>
	);
};

export default App;
