import React, {
	forwardRef,
	ForwardRefExoticComponent,
	RefAttributes,
	useImperativeHandle,
	useState,
	useRef,
} from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';

import { BLACK, PURE_WHITE } from '../libs/colors';

const styles = StyleSheet.create({
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

export const Toast: ForwardRefExoticComponent<
	RefAttributes<ToastRefAttributes>
> = forwardRef((_props, ref) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const tranAnim = useRef(new Animated.Value(0)).current;
	const [text, setText] = useState('');

	useImperativeHandle(
		ref,
		() => ({
			cheer(requestedText) {
				setText(requestedText);

				// reset animation
				tranAnim.setValue(0);
				fadeAnim.setValue(0);

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
			},
		}),
		[],
	);

	return (
		<>
			<Animated.View
				style={{
					position: 'absolute',
					width: '100%',
					bottom: 0,
					opacity: fadeAnim,
					transform: [{ translateY: tranAnim }],
				}}>
				<View style={styles.toast}>
					<Text style={styles.toastText}>{text}</Text>
				</View>
			</Animated.View>
		</>
	);
});
