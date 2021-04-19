import React, {
	FunctionComponent,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	Animated,
	StyleSheet,
	View,
	SafeAreaView,
	Text,
	ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Radios } from './Radios';
import { BLACK, PURE_WHITE } from '../libs/colors';
import * as ws from '../services/websocket';
import { AppContext } from './Provider';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		position: 'relative',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 32,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 16,
	},
	header: {
		color: BLACK,
		fontWeight: '700',
		fontSize: 24,
		marginBottom: 32,
	},
	toast: {
		borderRadius: 4,
		backgroundColor: PURE_WHITE,
		width: '100%',
		height: 48,
		shadowColor: BLACK,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowRadius: 4,
		shadowOpacity: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	toastText: {
		color: BLACK,
		fontSize: 16,
	},
});

export const Questions: FunctionComponent<
	StackScreenProps<QuestionStackTree, 'Questions'>
> = ({ navigation }) => {
	const { state } = useContext(AppContext);
	const [showToast, setShowTest] = useState(false);
	const [waiting, setWaiting] = useState(true);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const tranAnim = useRef(new Animated.Value(0)).current;

	//
	// memoize the callbacks
	//
	const onSelectCallback = useCallback(
		(option: Option) => {
			if (state.question && state.session) {
				// send student response
				ws.emit({
					action: 'submit',
					courseId: state.question.courseId,
					questionOptionId: option.key,
					questionId: '' + state.question.id, // make sure its a string
					sessionId: state.session.id.toString(),
					userId: state.id.toString(),
				});

				// show toast
				setShowTest(true);
			}
		},
		[state.question, state.session, state.id],
	);
	const endSessionCallback = useCallback<OnEndSessionCallback>(
		// pop to safely trigger the unmount
		// and reuse the current home component
		() => navigation.pop(),
		[],
	);

	useEffect(() => {
		ws.add('endSession', endSessionCallback);
		return () => ws.remove('endSession', endSessionCallback);
	}, []);

	useEffect(() => {
		if (showToast) {
			Animated.parallel([
				Animated.timing(tranAnim, {
					toValue: -32,
					useNativeDriver: true,
					duration: 1000,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					useNativeDriver: true,
					duration: 1000,
				}),
			]).start(() => {
				Animated.parallel([
					Animated.timing(tranAnim, {
						toValue: 0,
						useNativeDriver: true,
						duration: 1000,
						delay: 3000,
					}),
					Animated.timing(fadeAnim, {
						toValue: 0,
						useNativeDriver: true,
						duration: 1000,
						delay: 3000,
					}),
				]).start();
			});

			setShowTest(false);
		}
	}, [showToast]);

	useEffect(() => {
		const timePtr = setTimeout(setWaiting, 1000, false);

		setWaiting(true);

		// if this view is popped lets make sure we dont try to
		// update the state on an unmounted comp
		return () => clearTimeout(timePtr);
	}, [state.question]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<AppContext.Consumer>
					{({ state: { question } }) =>
						waiting || !question ? (
							<>
								<Text style={styles.header}>Waiting on Next Question</Text>
								<ActivityIndicator size='large' color={BLACK} />
							</>
						) : (
							<>
								<Text style={styles.header}>{question.question}</Text>
								<Radios
									options={question.QuestionOptions.map((q) => ({
										key: q.id.toString(),
										text: q.text,
									}))}
									onSelect={onSelectCallback}
								/>
							</>
						)
					}
				</AppContext.Consumer>
				<Animated.View // Special animatable View
					style={{
						position: 'absolute',
						width: '100%',
						bottom: 0,
						opacity: fadeAnim,
						transform: [{ translateY: tranAnim }],
					}}>
					<View style={styles.toast}>
						<Text style={styles.toastText}>Response Submitted</Text>
					</View>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
};
