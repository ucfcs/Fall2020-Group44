import React, { FunctionComponent, useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { oauthMobileURL } from '../services/oauth';
import { GOLD } from '../libs/colors';
import { AppContext } from './Provider';

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
			const rawUser = await AsyncStorage.getItem('user');

			// they have not successfully auth into the app
			if (!rawUser) {
				// therefore lets prep the app for canvas oauth
				const { url } = await oauthMobileURL();
				dispatch({ type: 'SET_URL', payload: url });
			} else {
				// parse stored json and save it to app state
				const user = JSON.parse(rawUser);
				dispatch({ type: 'SET_NAME', payload: user.name });
				dispatch({ type: 'SET_EMAIL', payload: user.email });
				dispatch({ type: 'SET_TOKEN', payload: user.token });
			}

			// always build connection to server
			dispatch({ type: 'CONNECT' });
		})();
	}, []);

	return (
		<View style={styles.container}>
			<ActivityIndicator size='large' />
		</View>
	);
};
