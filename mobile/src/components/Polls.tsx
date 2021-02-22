import React, { FunctionComponent } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Radios } from './Radios';
import { BLACK } from '../libs/colors';

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

export const Polls: FunctionComponent<
	StackScreenProps<PollStackTree, 'Polls'>
> = () => {
	const onSelect = (option: Option) => {
		console.log(option);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.header}>
					Who was the first president of the United States?
				</Text>
				<Radios
					options={[
						{ key: '1', text: 'Abraham Lincoln' },
						{ key: '2', text: 'Abraham Lincoln' },
						{ key: '3', text: 'Abraham Lincoln' },
						{ key: '4', text: 'Abraham Lincoln' },
					]}
					onSelect={onSelect}
				/>
			</View>
		</SafeAreaView>
	);
};
