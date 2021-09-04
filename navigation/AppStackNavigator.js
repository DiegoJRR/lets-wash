import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from '../components/Auth/SignUp';
import SignIn from '../components/Auth/SignIn';
import EmployeeProfile from '../components/EmployeeProfile';
import AddService from '../components/AddService/AddService';
import Chat from '../components/Messages/Chat';
import AddressAutoComplete from '../components/AddresAutoComplete/AddressAutoComplete';

import RequestDetailScreen from '../components/RequestDetail/RequestDetailScreen';

import { Stack } from './index';
import HomeNavigation from './AppDrawerNavigator';
import AddVehicleModal from '../components/Home/AddVehicleModal';

const HomeModalStack = createStackNavigator();

const HomeModalNavigator = (props) => (
    <HomeModalStack.Navigator mode="modal" headerMode="none">
        <HomeModalStack.Screen name="Home" component={HomeNavigation} />
        <HomeModalStack.Screen
            name="AddVehicleModal"
            component={AddVehicleModal}
        />
    </HomeModalStack.Navigator>
);

const AppStackNavigator = ({ isSignedIn }) => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName={isSignedIn ? 'Home' : 'SignIn'}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen
                    name="HomeWrapper"
                    component={HomeModalNavigator}
                />
                <Stack.Screen name="Employee" component={EmployeeProfile} />
                <Stack.Screen name="AddService" component={AddService} />
                <Stack.Screen
                    name="AutoComplete"
                    component={AddressAutoComplete}
                />
                <Stack.Screen
                    name="RequestDetail"
                    component={RequestDetailScreen}
                />
                <Stack.Screen name="ChatRoom" component={Chat} />
            </>
        ) : (
            <>
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="SignIn" component={SignIn} />
            </>
        )}
    </Stack.Navigator>
);

export default AppStackNavigator;
