import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { GOLD, GRAY_3 } from '../libs/colors';

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
	baseRadio: {
		height: 48,
		width: '100%',
		borderRadius: 4,
		borderWidth: 2,
		padding: 12,
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	dot: {
		width: 24,
		height: 24,
		borderRadius: 24,
		borderWidth: 2,
		marginRight: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	innerDot: {
		width: 10,
		height: 10,
		borderRadius: 10,
		backgroundColor: GOLD,
	},
});

export const Radios: FunctionComponent<RadioProps> = ({
	options,
	onSelect,
}) => {
	const [selectedOption, setSelectedOption] = useState<null | Option>(null);

	return (
		<>
			{options.map((option) => (
				<TouchableOpacity
					key={option.key}
					style={[
						styles.baseRadio,
						{
							borderColor: option.key === selectedOption?.key ? GOLD : GRAY_3,
						},
					]}
					onPress={() => {
						setSelectedOption(option);
						onSelect(option);
					}}>
					{option.key === selectedOption?.key ? (
						<View style={[styles.dot, { borderColor: GOLD }]}>
							<View style={styles.innerDot} />
						</View>
					) : (
						<View style={[styles.dot, { borderColor: GRAY_3 }]} />
					)}
					<Text>{option.text}</Text>
				</TouchableOpacity>
			))}
		</>
	);
};
