import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { GOLD, WHITE } from '../libs/colors';

const styles = StyleSheet.create({
	button: {
		width: '100%',
		height: 48,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	primary: {
		backgroundColor: GOLD,
	},
	secondary: {
		backgroundColor: WHITE,
	},
	text: {
		lineHeight: 25,
		fontSize: 18,
		textAlign: 'center',
	},
});

export const Button: FunctionComponent<ButtonProps> = ({
	text,
	type = 'primary',
	onPress = undefined,
}) => {
	return (
		<TouchableOpacity style={[styles.button, styles[type]]} onPress={onPress}>
			<Text style={styles.text}>{text}</Text>
		</TouchableOpacity>
	);
};
