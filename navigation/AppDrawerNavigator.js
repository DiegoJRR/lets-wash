import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, Button, Text, useTheme } from '@ui-kitten/components';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import Home from '../components/Home/Home';
import ProfileScreen from '../components/ProfileScreen';
import ClientRequestsScreen from '../components/ClientRequestsScreen/ClientRequests';
import { Label } from '../common';
import { themes } from '../themes';
import { DrawerNavigator } from './index';
import VehicleMenu from '../components/Home/VehicleMenu';
import { signOut } from '../redux/actions';

const CustomDrawerContent = (props) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { userData, userTheme } = useSelector((state) => ({
        userData: state.userData,
        userTheme: state.theme,
    }));

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme['background-basic-color-1'],
            }}
        >
            <Pressable
                style={{
                    flexDirection: 'row',
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                    alignContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: theme['border-basic-color-4'],
                    borderBottomWidth: 1,
                }}
                onPress={() => {
                    props.navigation.navigate('Perfil');
                }}
            >
                <Avatar
                    style={{
                        width: 50,
                        height: 50,
                        marginRight: 20,
                    }}
                    source={
                        userData.profilePicture
                            ? { uri: userData.profilePicture }
                            : require('../assets/placeholder.jpg')
                    }
                />
                <View style={{ flex: 1 }}>
                    <Text>{userData?.displayName}</Text>
                </View>
            </Pressable>
            <DrawerContentScrollView {...props}>
                <View style={{ flex: 1 }}>
                    {props.state.routeNames.map((route, idx) => {
                        if (['Inicio', 'Perfil'].includes(route)) return null;
                        const focused = idx === props.state.index;
                        return (
                            <Pressable
                                key={route}
                                onPress={() => props.navigation.navigate(route)}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 15,
                                }}
                            >
                                <Text
                                    category="label"
                                    style={{
                                        fontSize: 14,
                                        color: theme['text-basic-color'],
                                    }}
                                >
                                    {route}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 10 }}>
                <Label>Tema</Label>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 16,
                    }}
                >
                    {Object.keys(themes).map((theme, idx) => (
                        <Pressable
                            onPress={() => {
                                dispatch({
                                    type: 'setTheme',
                                    theme,
                                });
                            }}
                            key={idx}
                            style={{
                                backgroundColor: themes[theme].primary,
                                height: 30,
                                width: 30,
                                borderRadius: 50,
                                borderWidth: theme == userTheme ? 0 : 5,
                                borderColor: 'transparent',
                            }}
                        />
                    ))}
                </View>
                <Button
                    appearance="ghost"
                    status="danger"
                    onPress={() => {
                        auth()
                            .signOut()
                            .then((res) => props.dispatch(signOut()));
                    }}
                >
                    Cerrar Sesion
                </Button>
            </View>
        </View>
    );
};

const HomeNavigation = (props) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    return (
        <DrawerNavigator.Navigator
            initialRouteName="Inicio"
            screenOptions={{ headerShown: false, swipeEnabled: false }}
            drawerContent={(props) => (
                <CustomDrawerContent
                    {...props}
                    dispatch={dispatch}
                    navigation={navigation}
                />
            )}
            drawerContentOptions={{
                activeTintColor: theme['text-basic-color'],
                inactiveTintColor: theme['text-basic-color'],
                style: {
                    backgroundColor: theme['background-basic-color-2'],
                    padding: 0,
                    margin: 0,
                },
                contentContainerStyle: {
                    paddingVertical: 0,
                },
            }}
        >
            <DrawerNavigator.Screen name="Inicio" component={Home} />
            <DrawerNavigator.Screen name="Perfil" component={ProfileScreen} />
            <DrawerNavigator.Screen
                name="🎫 Solicitudes"
                component={ClientRequestsScreen}
            />
            <DrawerNavigator.Screen
                name="🚗 Mis Vehículos"
                component={VehicleMenu}
            />
        </DrawerNavigator.Navigator>
    );
};

export default HomeNavigation;
