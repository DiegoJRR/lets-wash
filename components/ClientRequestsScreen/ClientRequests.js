import React from 'react';
import {
    Icon,
    Divider,
    TopNavigation,
    TopNavigationAction,
    Layout,
} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Solicitud from './Solicitud';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const reqs = [
    {
        date: Date.now(),
        washer: 'Lavador 1',
        car: 'Car 1',
        service: 'Service 1',
        cost: 126,
    },
    {
        date: Date.now(),
        washer: 'Lavador 1',
        car: 'Car 1',
        service: 'Service 1',
        cost: 126,
    },
    {
        date: Date.now(),
        washer: 'Lavador 1',
        car: 'Car 1',
        service: 'Service 1',
        cost: 126,
    },
];

const ClientRequests = (props) => {
    const { userRequests } = props;
    const BackAction = () => (
        <TopNavigationAction
            onPress={() => props.navigation.goBack()}
            icon={BackIcon}
        />
    );

    return (
        <Layout
            style={{
                flex: 1,
                width: '100%',
            }}
        >
            <TopNavigation
                title="Solicitudes"
                style={{
                    backgroundColor: 'transparent',
                }}
                accessoryLeft={BackAction}
            />
            <Layout
                level="2"
                style={{
                    flex: 1,
                }}
            >
                <Divider />
                <ScrollView horizontal={false} contentContainerStyle={{}}>
                    {userRequests
                        .filter((req) => req.paid || req.payment.status == 'approved')
                        .map((req, idx) => (
                            <Solicitud key={idx} data={req} style={{}} />
                        ))}
                </ScrollView>
            </Layout>
        </Layout>
    );
};

export default connect((state) => ({ userRequests: state.userRequests }))(
    ClientRequests
);
