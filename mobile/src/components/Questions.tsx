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

import { Radios } from './Radios';
import { BLACK } from '../libs/colors';
import * as ws from '../services/websocket';
import { AppContext } from './Provider';
import { Toast } from './Toast';

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
});

export const Questions: FunctionComponent<
	StackScreenProps<QuestionStackTree, 'Questions'>
> = ({ navigation }) => {
	const { state } = useContext(AppContext);
	const [waiting, setWaiting] = useState(true);
	let toast: ToastRefAttributes | null = null;

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

				toast?.cheer('Response Submitted');
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
	const endQuestionCallback = useCallback<OnEndQuestionCallback>(() => {
		toast?.cheer('Answering is Locked');
	}, []);

	useEffect(() => {
		ws.add('endSession', endSessionCallback);
		ws.add('endQuestion', endQuestionCallback);
		return () => {
			ws.remove('endSession', endSessionCallback);
			ws.remove('endQuestion', endQuestionCallback);
		};
	}, []);

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
					{({ state: { question, questionIsLocked } }) =>
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
									disable={questionIsLocked}
								/>
							</>
						)
					}
				</AppContext.Consumer>
				<Toast
					ref={(t) => {
						// for some reason ref can come back as null
						if (t) toast = t;
					}}
				/>
			</View>
		</SafeAreaView>
	);
};
