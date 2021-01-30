import React, { FunctionComponent } from 'react';
import { StatusBar, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
	DrawerScreenProps,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from './Home';
import { Icon } from './Icon';
import { Settings } from './Settings';
import { BLACK, GOLD } from '../libs/colors';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const SettingsRouter: FunctionComponent<DrawerScreenProps<{}>> = () => {
	return (
		<>
			<StatusBar barStyle='dark-content' />

			<Stack.Navigator>
				<Stack.Screen name='settings' component={Settings} />
			</Stack.Navigator>
		</>
	);
};

const HomeRouter: FunctionComponent<DrawerScreenProps<{}>> = ({
	navigation,
}) => {
	return (
		<>
			<StatusBar barStyle='dark-content' />

			<Stack.Navigator>
				<Stack.Screen
					name='home'
					component={Home}
					options={{
						title: 'Poll',
						headerStyle: { backgroundColor: GOLD },
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerLeft: () => (
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
						),
					}}
				/>
			</Stack.Navigator>
		</>
	);
};

const Router: FunctionComponent = () => {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName='Home'
				drawerContentOptions={{
					activeTintColor: BLACK,
					itemStyle: { marginVertical: 5 },
				}}
				drawerContent={(props) => (
					<DrawerContentScrollView {...props}>
						<View>
							<View
								style={{
									width: 64,
									height: 64,
									borderRadius: 32,
									backgroundColor: 'red',
								}}
							/>
							<Text>LOL</Text>
						</View>
						<DrawerItemList {...props} />
						<DrawerItem
							label='Logout'
							onPress={() => console.log('s')}
							pressColor='#F00'
						/>
					</DrawerContentScrollView>
				)}>
				<Drawer.Screen
					name='Home'
					component={HomeRouter}
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

export default Router;
