/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { FunctionComponent, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { Splash } from './components/Splash';
import { Login } from './components/Login';
import { Router } from './components/Router';

const App: FunctionComponent = () => {
	const [state, setState] = useState<number>(0);

	useEffect(() => {
		setTimeout(() => {
			// to login
			setState(1);

			// to the rest of the app
			setState(2);
		}, 3000);
	}, []);

	if (state === 0) {
		return (
			<>
				<StatusBar barStyle='dark-content' />
				<Splash />
			</>
		);
	}

	if (state === 1) {
		return (
			<>
				<StatusBar barStyle='dark-content' />
				<Login />
			</>
		);
	}

	return (
		<>
			<StatusBar barStyle='dark-content' />
			<Router />
		</>
	);
};

export default App;
