import React, { FunctionComponent, useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { GOLD } from '../libs/colors';
import { AppContext } from './Provider';
import { load } from '../services/store';
import { canvasSelf } from '../services/backend';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: GOLD,
	},
});

export const Splash: FunctionComponent = () => {
	const { dispatch } = useContext(AppContext);

	useEffect(() => {
		(async () => {
			// first lets try to see if theres a token in the local storage
			const token = await load();

			if (!token) {
				// token was not found in local storage so well need
				// to ask if the user wants to login
				dispatch({ type: 'SET_PHASE', payload: 'authentication' });
			} else {
				// the token was found and well want todo a few things

				// 1. connect to the WS server
				dispatch({ type: 'CONNECT' });

				// 2. get user info from canvas
				const res = await canvasSelf(token, {
					url: '/api/v1/users/self',
					method: 'GET',
				});
				const data = await res.json();

				if (res.status !== 200) {
					dispatch({ type: 'SET_PHASE', payload: 'authentication' });
					return;
				}

				// 3. route users to the main app views
				dispatch({ type: 'SET_TOKEN', payload: token });
				dispatch({ type: 'SET_NAME', payload: data.payload.name });
				dispatch({ type: 'SET_EMAIL', payload: data.payload.email });
				dispatch({ type: 'SET_PHASE', payload: 'connection' });
			}
		})();
	}, []);

	return (
		<View style={styles.container}>
			<ActivityIndicator size='large' />
		</View>
	);
};
