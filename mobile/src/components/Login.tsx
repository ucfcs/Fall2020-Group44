import React, {
	useEffect,
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

import { oauthMobileURL } from '../services/oauth';
import { save } from '../services/store';
import { WHITE } from '../libs/colors';
import { Button } from './Button';
import { AppContext } from './Provider';
import { Icon } from './Icon';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: WHITE,
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
		marginBottom: 32,
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
	const { dispatch } = useContext(AppContext);

	const handlePress = async () => {
		try {
			setIsReadingAuthLink(true);

			// Checking if the link is supported for links with custom URL scheme.
			const { url } = await oauthMobileURL();
			const supported = await Linking.canOpenURL(url);

			if (supported) {
				// Opening the link with some app, if the URL scheme is "http" the web link should be opened
				// by some browser in the mobile
				await Linking.openURL(url);
			} else {
				console.error(url);
			}
		} catch (error) {
			console.error(error);
			Alert.alert('Error in auth', 'Server is down');
			setIsReadingAuthLink(false);
		}
	};

	useEffect(() => {
		Linking.addEventListener('url', async (event) => {
			// get url from event of deep linking
			const { url } = event;

			if (!url) {
				setIsReadingAuthLink(false);
				Alert.alert('Error in auth', 'Error in auth stage 1');
				return;
			}

			// param section
			const temp = url.split('?')[1];

			if (!temp) {
				setIsReadingAuthLink(false);
				Alert.alert('Error in auth', 'Error in auth stage 2');
				return;
			}

			// get value after the ket "token="
			const token = temp.split('=')[1];

			if (!token) {
				setIsReadingAuthLink(false);
				Alert.alert('Error in auth', 'Error in auth stage 3');
				return;
			}

			// store token in the local storage
			await save(token);

			// move back to splash to run through the init protocals
			dispatch({ type: 'SET_PHASE', payload: 'initializing' });
		});

		// on unmount remove all listeners
		return () => Linking.removeAllListeners('url');
	}, []);

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<View style={styles.logoBox}>
						<Icon type='logo' />
					</View>
					<Button text='Sign In' type='primary' onPress={handlePress} />
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
