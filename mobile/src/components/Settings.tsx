import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Switch } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { GRAY_4 } from '../libs/colors';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		padding: 16,
	},
	field: {
		width: '100%',
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomColor: GRAY_4,
		borderBottomWidth: 1,
	},
});

export const Settings: FunctionComponent<
	StackScreenProps<SettingsStackTree, 'Settings'>
> = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.field}>
					<Text>Enable Push Notification</Text>
					<Switch onValueChange={toggleSwitch} value={isEnabled} />
				</View>
			</View>
		</SafeAreaView>
	);
};
