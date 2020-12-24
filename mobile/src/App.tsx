/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './components/Splash';
import Help from './components/Help';

const Stack = createStackNavigator();

const App = () => {
	const [loading, setLoading] = useState(false);

	if (loading) {
		return <Splash />;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='home'
					component={Help}
					options={{ title: 'Welcome' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
