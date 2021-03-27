import React, { FunctionComponent, useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { GOLD } from '../libs/colors';
import { AppContext } from './Provider';
import { load } from '../services/store';
import { getCanvasSelf, getUserSetting } from '../services/backend';
import * as ws from '../services/websocket';

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
				// 1. save the token
				dispatch({ type: 'SET_TOKEN', payload: token });

				// 2. connect to the WS server
				ws.init();

				// 3. get user info from canvas
				try {
					const data = await getCanvasSelf(token);

					dispatch({ type: 'SET_NAME', payload: data.payload.name });
					dispatch({ type: 'SET_EMAIL', payload: data.payload.email });
				} catch (error) {
					console.error(error);
					dispatch({ type: 'SET_PHASE', payload: 'authentication' });
					return;
				}

				// 4. get user settings data
				try {
					const { settings } = await getUserSetting(token);

					// make sure its not null
					if (settings && settings.document) {
						dispatch({
							type: 'SET_SETTING',
							payload: JSON.parse(settings.document),
						});
					}
				} catch (error) {
					console.error(error);
					dispatch({ type: 'SET_PHASE', payload: 'authentication' });
					return;
				}

				// 5. route users to the main app views
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
