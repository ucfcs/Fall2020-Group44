import React, {
	useEffect,
	useCallback,
	FunctionComponent,
	useState,
	useContext,
} from 'react';
import {
	StyleSheet,
	View,
	SafeAreaView,
	Linking,
	Alert,
	ActivityIndicator,
} from 'react-native';

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
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.25)',
	},
});

export const Login: FunctionComponent = () => {
	const [isReadingAuthLink, setIsReadingAuthLink] = useState(false);
	const { state, dispatch } = useContext(AppContext);
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
		Linking.addEventListener('url', async (event) => {
			const { url } = event;

			// assume this run is good
			setIsReadingAuthLink(true);

			// make sure its set
			if (!url) {
				setIsReadingAuthLink(false);
				Alert.alert('Error in auth', 'Error in auth stage 1');
				return;
			}

			// param section
			const temp1 = url.split('?')[1];

			if (!temp1) {
				setIsReadingAuthLink(false);
				Alert.alert('Error in auth', 'Error in auth stage 2');
				return;
			}

			// get value after the ket "token="
			const token = temp1.split('=')[1];
			console.log('jwt =', token);

			// make call to server for user info
			// then save it to the app state context
			dispatch({ type: 'AUTHENTICATED' });
		});

		// on unmount remove all listeners
		return () => Linking.removeAllListeners('url');
	}, []);

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<View style={styles.logoBox} />
					<Button text='Sign In' type='secondary' onPress={handlePress} />
				</View>
			</SafeAreaView>
			{isReadingAuthLink && (
				<View style={styles.overlay}>
					<ActivityIndicator color='white' size='large' />
				</View>
			)}
		</>
	);
};
