import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
	DrawerScreenProps,
	DrawerNavigationProp,
	DrawerContentComponentProps,
	DrawerContentOptions,
} from '@react-navigation/drawer';
import {
	createStackNavigator,
	StackNavigationOptions,
} from '@react-navigation/stack';

import { Icon } from './Icon';
import { Home } from './Home';
import { Polls } from './Polls';
import { Settings } from './Settings';
import { BLACK, GOLD, GRAY_2 } from '../libs/colors';

const Drawer = createDrawerNavigator<RootTree>();
const PollStack = createStackNavigator<PollStackTree>();
const SettingsStack = createStackNavigator<SettingsStackTree>();

const options: StackNavigationOptions = {
	headerStyle: { backgroundColor: GOLD },
	headerTitleStyle: {
		fontWeight: 'bold',
	},
};

//
// Poll Router
//

const PollRouter: FunctionComponent<
	DrawerScreenProps<PollStackTree, 'Home'>
> = ({ navigation }) => {
	return (
		<PollStack.Navigator>
			<PollStack.Screen
				name='Home'
				component={Home}
				options={{
					title: 'Polls',
					headerLeft: headerLeftController.bind(this, navigation),
					...options,
				}}
			/>
			<PollStack.Screen
				name='Polls'
				component={Polls}
				options={{ title: 'Class', ...options }}
			/>
		</PollStack.Navigator>
	);
};

//
// Settings Router
//

const SettingsRouter: FunctionComponent<
	DrawerScreenProps<SettingsStackTree, 'Settings'>
> = ({ navigation }) => {
	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name='Settings'
				component={Settings}
				options={{
					title: 'Settings',
					headerLeft: headerLeftController.bind(this, navigation),
					...options,
				}}
			/>
		</SettingsStack.Navigator>
	);
};

//
// Root Router
//

export const Router: FunctionComponent = () => {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName='Polls'
				drawerContentOptions={{
					activeTintColor: BLACK,
					itemStyle: { marginVertical: 5 },
				}}
				drawerContent={drawerContent}>
				<Drawer.Screen
					name='Polls'
					component={PollRouter}
					options={{ drawerLabel: 'Polls' }}
				/>
				<Drawer.Screen
					name='Settings'
					component={SettingsRouter}
					options={{ drawerLabel: 'Settings' }}
				/>
			</Drawer.Navigator>
		</NavigationContainer>
	);
};

//
// Helper functions
//

const headerLeftController = (
	navigation:
		| DrawerNavigationProp<PollStackTree, 'Home'>
		| DrawerNavigationProp<SettingsStackTree, 'Settings'>,
) => {
	return (
		<TouchableOpacity
			style={{
				width: 44,
				height: 44,
				justifyContent: 'center',
				alignItems: 'center',
			}}
			onPress={() => navigation.openDrawer()}>
			<Icon type='burger' />
		</TouchableOpacity>
	);
};

const drawerContent = (
	props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
	return (
		<DrawerContentScrollView {...props}>
			<View style={{ padding: 16 }}>
				<View
					style={{
						width: 64,
						height: 64,
						borderRadius: 32,
						backgroundColor: 'red',
						overflow: 'hidden',
						marginBottom: 8,
					}}>
					<ImageBackground
						source={require('../assets/images/temp.png')}
						style={{
							width: 64,
							height: 64,
						}}
					/>
				</View>
				<Text
					style={{
						fontSize: 18,
						color: BLACK,
						marginBottom: 4,
					}}>
					Kenny G Perez
				</Text>
				<Text
					style={{
						fontSize: 14,
						color: GRAY_2,
					}}>
					joseperez407@knights.ucf.edu
				</Text>
			</View>
			<DrawerItemList {...props} />
			<DrawerItem
				label='Logout'
				onPress={() => console.log('s')}
				pressColor='#F00'
			/>
		</DrawerContentScrollView>
	);
};
