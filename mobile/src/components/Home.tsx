import React, {
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	StyleSheet,
	View,
	SafeAreaView,
	Text,
	ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from './Button';
import { BLACK, GRAY_2 } from '../libs/colors';
import { Icon } from './Icon';
import { AppContext } from './Provider';
import { getCanvasUserEnrollments } from '../services/backend';
import * as ws from '../services/websocket';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	containerNonEmpty: {
		justifyContent: 'flex-start',
		paddingTop: 32,
	},
	emptyPic: {
		width: 128,
		height: 128,
		borderRadius: 128,
		borderColor: GRAY_2,
		borderWidth: 2,
		backgroundColor: 'transparent',
		marginBottom: 32,
	},
	header: {
		fontWeight: '700',
		fontSize: 24,
		marginBottom: 8,
		color: BLACK,
		textAlign: 'center',
	},
	p: {
		color: GRAY_2,
		fontSize: 14,
		fontWeight: '400',
		textAlign: 'center',
		marginBottom: 32,
	},
});

export const Home: FunctionComponent<
	StackScreenProps<PollStackTree, 'Home'>
> = ({ navigation }) => {
	const { state } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isEmpty] = useState(true);

	// onMount
	useEffect(() => {
		(async () => {
			// HTTP - pull all currently enrolled courses
			const { payload } = await getCanvasUserEnrollments(state.token);

			// WS - use course unique id's as room keys to join
			// loop through courses and join the WS rooms
			for (const course of payload) {
				ws.join(course.id.toString());
			}

			// HTTP - fetch most recent session

			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<ActivityIndicator color={BLACK} size='large' />
				</View>
			</SafeAreaView>
		);
	}

	if (isEmpty) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<View style={styles.emptyPic}>
						<Icon type='hand' />
					</View>
					<Text style={styles.header}>No sessions currently</Text>
					<Text style={styles.p}>
						Sessions will appear here when available.
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={[styles.container, styles.containerNonEmpty]}>
				<Text style={styles.header}>Attendance</Text>
				<Text style={styles.p}>History 101 - First week of school</Text>
				<Button text='Join' onPress={() => navigation.push('Polls')}></Button>
			</View>
		</SafeAreaView>
	);
};
