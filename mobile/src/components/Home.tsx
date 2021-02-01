import React, { FunctionComponent } from 'react';
import {
	StyleSheet,
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

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
});

export const Home: FunctionComponent<
	StackScreenProps<PollStackTree, 'Home'>
> = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<TouchableOpacity onPress={() => navigation.push('Polls')}>
					<Text>HOME</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};
