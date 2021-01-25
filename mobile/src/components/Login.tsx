import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import { GOLD } from '../libs/colors';
import { Button } from './Button';

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

const Splash = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.logoBox} />
				<Button text='Sign In' type='secondary' />
			</View>
		</SafeAreaView>
	);
};

export default Splash;
