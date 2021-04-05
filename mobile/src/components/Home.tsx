import React, {
	FunctionComponent,
	useCallback,
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
import { BLACK, GRAY_2, GREEN } from '../libs/colors';
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
	containerEmpty: {
		justifyContent: 'center',
		paddingTop: 32,
	},
	containerNonEmpty: {
		justifyContent: 'flex-start',
		paddingTop: 128,
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
	pGreen: {
		color: GREEN,
		fontSize: 18,
		fontWeight: '900',
	},
});

export const Home: FunctionComponent<
	StackScreenProps<QuestionStackTree, 'Home'>
> = ({ navigation }) => {
	const { state, dispatch } = useContext(AppContext);

	// this is used to give the home screen enough time
	// to connect to the WS server
	const [isLoading, setIsLoading] = useState(true);

	// memoize these functions to only allocate
	const startQuestionCallback = useCallback<OnStartQuestionCallback>(
		(data) =>
			dispatch({
				type: 'SET_QUESTION',
				payload: data.payload,
			}),
		[],
	);
	const endQuestionCallback = useCallback<OnEndQuestionCallback>(
		() =>
			dispatch({
				type: 'SET_QUESTION',
				payload: null,
			}),
		[],
	);
	const startSessionCallback = useCallback<OnStartSessionCallback>(
		(data) =>
			dispatch({
				type: 'SET_SESSION',
				payload: data.payload,
			}),
		[],
	);
	const endSessionCallback = useCallback<OnEndSessionCallback>(
		() =>
			dispatch({
				type: 'SET_SESSION',
				payload: null,
			}),
		[],
	);

	// on mount
	useEffect(() => {
		(async () => {
			ws.add('startQuestion', startQuestionCallback);
			ws.add('endQuestion', endQuestionCallback);
			ws.add('startSession', startSessionCallback);
			ws.add('endSession', endSessionCallback);

			// HTTP - pull all currently enrolled courses
			const payload = await getCanvasUserEnrollments(state.token);


			// WS - use course unique id's as room keys to join
			// joining also emits info about the currently active session
			// loop through courses and join the WS rooms
			if (Array.isArray(payload)) {
				for (const course of payload) {
					ws.join(course.id.toString());
				}
			}

			// we have connectedc to the WS server so show home page
			setIsLoading(false);

			// on unmount
			return () => {
				ws.remove('startQuestion', startQuestionCallback);
				ws.remove('endQuestion', endQuestionCallback);
				ws.remove('startSession', startSessionCallback);
				ws.remove('endSession', endSessionCallback);
			};
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
	} else {
		return (
			<SafeAreaView style={styles.safeArea}>
				<AppContext.Consumer>
					{({ state: { session } }) =>
						session == null ? (
							// render when no session is not found
							<View style={[styles.container, styles.containerEmpty]}>
								<View style={styles.emptyPic}>
									<Icon type='hand' />
								</View>
								<Text style={styles.header}>No sessions currently</Text>
								<Text style={styles.p}>
									Sessions will appear here when available.
								</Text>
							</View>
						) : (
							// render when session is found
							<View style={[styles.container, styles.containerNonEmpty]}>
								<Text style={styles.header}>{session.name}</Text>
								<Text style={[styles.p, styles.pGreen]}>
									Questions Session In Progress
								</Text>
								<Button
									text='Join'
									onPress={() => navigation.push('Questions')}></Button>
							</View>
						)
					}
				</AppContext.Consumer>
			</SafeAreaView>
		);
	}
};
