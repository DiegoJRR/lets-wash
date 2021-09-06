import React from 'react';
import {
    Icon,
    Divider,
    TopNavigation,
    TopNavigationAction,
    Layout,
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import EditCarModal from "./EditCarModal";
import ChooseCar from "../AddService/ChooseCar";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const MyCarsStack = createStackNavigator();

const VehicleMenu = (props) => {
    const menu = () => (
        <Layout
            style={{
                flex: 1,
                width: '100%',
            }}
        >
            <TopNavigation
                title="Mis Vehículos "
                style={{
                    backgroundColor: 'transparent',
                }}
                accessoryLeft={BackAction}
            />
            <Layout
                level="2"
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
                <Divider />
                <ChooseCar navigation={props.navigation} />
            </Layout>
        </Layout>
    );

    const BackAction = () => (
        <TopNavigationAction
            onPress={() => props.navigation.goBack()}
            icon={BackIcon}
        />
    );

    return (
        <MyCarsStack.Navigator mode="modal" screenOptions={{"headerShown": false}}>
            <MyCarsStack.Screen name="Mis Vehículos" component={menu} />
            <MyCarsStack.Screen name="EditCarModal" component={EditCarModal} />
        </MyCarsStack.Navigator>
    );
};

export default connect((state) => ({ vehicles: state.vehicles }))(VehicleMenu);
