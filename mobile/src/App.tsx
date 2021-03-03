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
				{({ state: { phase } }) => {
					if (phase === 'isolated') {
						return <Splash />;
					} else {
						if (phase === 'connected') {
							return <Login />;
						}
						if (phase === 'authenticated') {
							return <Router />;
						}
					}
				}}
			</AppContext.Consumer>
		</Provider>
	);
};

export default App;
