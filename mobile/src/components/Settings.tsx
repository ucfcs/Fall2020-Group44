import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Switch } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { GRAY_4 } from '../libs/colors';
import { AppContext } from './Provider';
import { setUserSetting } from '../services/backend';

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
	const EMIT_DELAY_TIME = 250; // milliseconds
	const { state, dispatch } = useContext(AppContext);
	const [timeoutPtr, setTimeoutPtr] = useState<number>(0);

	const sendUpdatedSettingsToDB = () => {
		// update on the server
		setUserSetting(state.token, state.settings);
	};

	const togglePushNotification = () => {
		// update locally
		dispatch({
			type: 'SET_SETTING_PUSHNOTIFICATION',
		});

		// throttle emits
		clearTimeout(timeoutPtr);
		setTimeoutPtr(
			(setTimeout(
				sendUpdatedSettingsToDB,
				EMIT_DELAY_TIME,
			) as unknown) as number,
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<AppContext.Consumer>
					{({ state: { settings } }) => (
						<View style={styles.field}>
							<Text>Enable Push Notification</Text>
							<Switch
								onValueChange={togglePushNotification}
								value={settings.enablePushNotification as boolean}
							/>
						</View>
					)}
				</AppContext.Consumer>
			</View>
		</SafeAreaView>
	);
};
