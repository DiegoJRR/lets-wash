import React, { useContext, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Card,
    Text,
    Button,
    Divider,
    useTheme,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addService, removeService } from '../../../redux/actions';
import { currencyFormat } from '../../../common';
import { defaultFooterOptions, requestFormContext } from './RequestFormContext';

const VehicleSelector = (props) => {
    const { navigate } = useNavigation();
    const theme = useTheme();
    const { service, vehicle, onDelete, onAdd, data } = props;
    const cost = service
        ? service.fees.find((fee) => fee.type == vehicle.type).cost
        : 0;

    return (
        <View
            style={{
                flexDirection: 'row',
                width: '100%',
                marginBottom: 8,
            }}
        >
            <Card
                onPress={() => {
                    if (data.active) {
                        onDelete();
                    } else {
                        navigate('AddService', {
                            service: props.data,
                            index: 1,
                        });
                    }
                }}
                style={{
                    flex: 1,
                    borderRadius: 20,
                    borderColor: data.active
                        ? theme['border-primary-color-1']
                        : theme['border-basic-color-4'],
                    borderWidth: 2,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon
                        name="car"
                        style={{
                            marginVertical: 10,
                            marginRight: 15,
                            fontSize: 26,
                            color: vehicle.color,
                            textAlign: 'center',
                        }}
                    ></Icon>
                    <View
                        style={{
                            flex: 1,
                            position: 'relative',
                        }}
                    >
                        <View
                            style={{
                                width: '50%',
                            }}
                        >
                            <Text category="p1" style={{ fontWeight: 'bold' }}>
                                {vehicle.alias}
                            </Text>
                            <Text category="label">
                                Modelo: {vehicle.brand}
                            </Text>
                        </View>
                        {data.active && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    width: '50%',
                                }}
                            >
                                <Text category="label">
                                    {`${service.name}: ${currencyFormat(cost)}`}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Card>
        </View>
    );
};

const ServiceSelection = (props) => {
    const context = useContext(requestFormContext);
    const navigation = useNavigation();
    const theme = useTheme();
    if (props.hidden) return null;
    const {
        services,
        vehicleTypes,
        active,
        vehicles,
        removeService: deleteService,
        addService,
    } = props;

    const checkAllowStep = () => {
        if (!active) return;

        const filteredServices = services.filter((s) => s.active);
        if (
            (filteredServices.length == 0 ||
                filteredServices.filter((sv) => !sv.service).length > 0) &&
            context.allowStep
        ) {
            context.setAllowStep(false);
        } else if (
            filteredServices.length > 0 &&
            filteredServices.filter((sv) => !sv.service).length == 0 &&
            !context.allowStep
        ) {
            context.setAllowStep(true);
        }
    };

    useEffect(() => {
        checkAllowStep();
        if (active) {
            context.setFooterOptions(defaultFooterOptions);
        }
    }, [active]);

    useEffect(() => {
        checkAllowStep();
    }, []);

    useEffect(() => {
        checkAllowStep();
    }, [services]);

    const Header = (props) => (
        <View
            pointerEvents="box-none"
            {...props}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 12,
                marginHorizontal: 15,
            }}
        >
            <Text category="h4" style={{ fontWeight: 'bold' }}>
                {props.title}
            </Text>
        </View>
    );
    if (!props.render)
        return (
            <View
                style={{
                    width: '100%',
                    flex: 1,
                }}
            ></View>
        );

    return (
        <View
            style={{
                width: '100%',
                flex: 1,
            }}
        >
            <Header title={'¿Qué vehículo(s) quieres lavar?'} />
            <Divider></Divider>
            <ScrollView style={{ flex: 1, margin: 10 }}>
                {vehicles
                    .map((vehicle) => ({
                        ...vehicle,
                        serviceData: services.find(
                            (s) => s.vehicle.ref == vehicle.ref
                        ) ?? {
                            active: false,
                            service: null,
                            vehicle,
                        },
                    }))
                    .sort((a, b) => {
                        if (a.serviceData.active) return -1;
                        return 1;
                    })
                    .map((vehicle, idx) => {
                        const { serviceData } = vehicle;

                        return (
                            <VehicleSelector
                                index={idx}
                                onDelete={() => {
                                    deleteService(vehicle.ref);
                                }}
                                onAdd={() => {
                                    const service = services.find(
                                        (s) => s.vehicle.ref == vehicle.ref
                                    );

                                    if (service) {
                                        addService(serviceData);
                                    } else {
                                        addService({
                                            vehicle,
                                            service: null,
                                        });
                                    }
                                }}
                                key={idx}
                                vehicle={{
                                    ...vehicle,
                                    typeName: vehicleTypes.find(
                                        (vt) => vt.ref == vehicle.type
                                    ).name,
                                }}
                                service={serviceData.service}
                                data={serviceData}
                            />
                        );
                    })}
            </ScrollView>
            <Button
                appearance="ghost"
                onPress={() => navigation.navigate('AddVehicleModal')}
                style={{
                    margin: 10,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: theme['border-basic-color-4'],
                }}
            >
                <View
                    style={{
                        position: 'relative',
                    }}
                >
                    <MaterialIcon
                        name={'plus'}
                        style={[
                            {
                                position: 'absolute',
                                transform: [
                                    { translateX: 12 },
                                    { translateY: -6 },
                                ],
                                color: theme['text-primary-color'],
                                fontSize: 16,
                            },
                        ]}
                    ></MaterialIcon>

                    <Icon
                        name={'car'}
                        style={{
                            marginTop: 5,
                            transform: [{ translateX: -2 }],
                            color: theme['text-primary-color'],
                            fontSize: 16,
                        }}
                    ></Icon>
                </View>
            </Button>
        </View>
    );
};

const mapStateToProps = (state) => {
    const { vehicles, services, vehicleTypes } = state;
    return { vehicles, services, vehicleTypes };
};

export default connect(mapStateToProps, { addService, removeService })(
    ServiceSelection
);
