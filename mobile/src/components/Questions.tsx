import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Radios } from './Radios';
import { BLACK } from '../libs/colors';
import * as ws from '../services/websocket';
import { AppContext } from './Provider';

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
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
	const onSelectCallback = useCallback((option: Option) => {
		console.log(option);
	}, []);

	// memoize the ws callbacks
	const endSessionCallback = useCallback<OnEndSessionCallback>(
		// pop to safely trigger the unmount
		// and reuse the current home component
		() => navigation.pop(),
		[],
	);

	// on mount
	useEffect(() => {
		ws.add('endSession', endSessionCallback);
		// on unmount
		return () => ws.remove('endSession', endSessionCallback);
	}, []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<AppContext.Consumer>
					{({ state: { question } }) =>
						question === null ? (
							<Text style={styles.header}>Waiting for question</Text>
						) : (
							<>
								<Text style={styles.header}>{question.title}</Text>
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
			</View>
		</SafeAreaView>
	);
};
