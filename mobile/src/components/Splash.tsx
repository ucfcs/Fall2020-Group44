import React, { FunctionComponent } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { GOLD } from '../libs/colors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: GOLD,
	},
});

export const Splash: FunctionComponent = () => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size='large' />
		</View>
	);
};
