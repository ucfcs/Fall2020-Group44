import React, {
	useEffect,
	useCallback,
	FunctionComponent,
	useState,
	useContext,
} from 'react';
import { StyleSheet, View, SafeAreaView, Linking } from 'react-native';

import { GOLD } from '../libs/colors';
import { Button } from './Button';
import { AppContext } from './Provider';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: GOLD,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	logoBox: {
		width: '100%',
		height: 320,
	},
});

export const Login: FunctionComponent = () => {
	const { state } = useContext(AppContext);
	const handlePress = useCallback(async () => {
		// Checking if the link is supported for links with custom URL scheme.
		const supported = await Linking.canOpenURL(state.url);

		if (supported) {
			// Opening the link with some app, if the URL scheme is "http" the web link should be opened
			// by some browser in the mobile
			await Linking.openURL(state.url);
		} else {
			console.error(state.url);
		}
	}, [state.url]);

	useEffect(() => {
		Linking.addEventListener('url', (event) => {
			const { url } = event;

			// make sure its set
			if (!url) {
				return;
			}

			console.log(url);
		});
		return () => Linking.removeAllListeners('url');
	}, []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.logoBox} />
				<Button text='Sign In' type='secondary' onPress={handlePress} />
			</View>
		</SafeAreaView>
	);
};
