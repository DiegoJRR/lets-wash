import React from 'react';
import { View, ScrollView } from 'react-native';

import {
    Layout,
    TopNavigation,
    TopNavigationAction,
    Icon,
    Divider,
    Text,
    Button,
    withStyles,
} from '@ui-kitten/components';
import moment from 'moment/min/moment-with-locales';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import {
    PageHeader,
    Label,
    currencyFormat,
    DataItem,
    Row,
    VehicleServiceRow,
} from '../../common';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RequestDetailScreen = (props) => {
    const {
        startTime,
        employeeData,
        services,
        cost,
        details,
        fulfilled,
        location,
        duration,
        washer,
        serviceStartTime,
    } = props.route.params.request;

    const { servicesTypes, vehicleTypes, vehicles } = props;

    const styles = props.eva.style;

    const openMessages = () => {
        props.navigation.navigate('ChatRoom', {
            request: {
                employee: {
                    ...employeeData,
                    ref: washer,
                },
            },
        });
    };

    const displayStartTime = moment(serviceStartTime ?? Date.now());
    const lapse = moment.duration(duration);
    const displayEndTime = displayStartTime.add(lapse);

    moment.locale('es-mx');
    const date = startTime?._seconds
        ? moment.unix(startTime?._seconds)
        : moment(rawDate);

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigation
                accessoryLeft={() => (
                    <TopNavigationAction
                        icon={BackIcon}
                        onPress={() => props.navigation.goBack()}
                    />
                )}
            />
            <Layout style={{ paddingHorizontal: 10, flex: 1 }}>
                <PageHeader
                    text="Solicitud"
                    rightButton={(props) => fulfilled ? null : (
                            <Button onPress={openMessages} appearance="ghost">
                                <Icon
                                    {...props}
                                    style={{
                                        width: 32,
                                        height: 32,
                                    }}
                                    fill="#222B45"
                                    name="message-square-outline"
                                />
                            </Button>
                        )}
                />
                <Divider />
                <Layout
                    style={{
                        flex: 1,
                        padding: 5,
                    }}
                >
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            // paddingBottom: 50,
                        }}
                    >
                        <Row style={{ alignItems: 'flex-start' }}>
                            <DataItem
                                style={{ flex: 1 }}
                                label="Fecha"
                                text={date.format('DD / MM / YYYY hh:mm')}
                            />
                            <DataItem
                                style={{ flex: 1 }}
                                label="Empleado"
                                text={`${employeeData.firstName} ${employeeData.lastName}`}
                            />
                        </Row>
                        <Label>Servicios</Label>
                        <View style={{ marginVertical: 5 }}>
                            <Layout
                                level="2"
                                style={{ padding: 5, paddingHorizontal: 10 }}
                            >
                                {services.map((service, idx) => {
                                    const vehicle = vehicles.find(
                                        (v) => v.ref == service.vehicle
                                    );

                                    if (!vehicle) return null;
                                    return (
                                        <VehicleServiceRow
                                            key={idx}
                                            vehicleType={
                                                vehicleTypes.find(
                                                    (v) =>
                                                        v.ref == vehicle?.type
                                                )?.name
                                            }
                                            brand={vehicle.brand}
                                            model={vehicle.model}
                                            color={vehicle.color}
                                            serviceType={
                                                servicesTypes.find(
                                                    (s) =>
                                                        s.ref ==
                                                        service?.service
                                                )?.name
                                            }
                                        />
                                    );
                                })}
                            </Layout>
                        </View>
                        <DataItem label="Detalles" text={details} />
                        <DataItem
                            label="Direccion"
                            textComponent={(props) => (
                                    <>
                                        {location?.main_text?.length > 0 && (
                                            <>
                                                <Text>
                                                    {location.main_text}
                                                </Text>
                                                <Text>
                                                    {location?.secondary_text}
                                                </Text>
                                            </>
                                        )}
                                    </>
                                )}
                        />
                        <Layout style={styles.map} level="2">
                            <MapboxGL.MapView
                                scrollEnabled={false}
                                zoomEnabled
                                style={{
                                    width: '100%',
                                    flex: 1,
                                }}
                                styleURL="mapbox://styles/diegojrr00/ckhfrdjnk00ii19pkqsz6mm3h"
                                showUserLocation
                            >
                                <MapboxGL.Camera
                                    zoomLevel={15}
                                    animationMode="flyTo"
                                    animationDuration={1500}
                                    centerCoordinate={
                                        location?.coordinates
                                            ? [
                                                  location.coordinates
                                                      ._longitude,
                                                  location.coordinates
                                                      ._latitude,
                                              ]
                                            : [-100.291648, 25.651579]
                                    }
                                />
                                <MapboxGL.MarkerView
                                    id="postion"
                                    coordinate={
                                        location?.coordinates
                                            ? [
                                                  location.coordinates
                                                      ._longitude,
                                                  location.coordinates
                                                      ._latitude,
                                              ]
                                            : [-100.291648, 25.651579]
                                    }
                                >
                                    <View>
                                        <View style={styles.markerContainer}>
                                            <MaterialIcons
                                                name="location-on"
                                                size={styles.marker.size}
                                                color={styles.marker.color}
                                            />
                                        </View>
                                    </View>
                                </MapboxGL.MarkerView>
                            </MapboxGL.MapView>
                        </Layout>
                    </ScrollView>
                    {fulfilled && (
                        <Row style={{ alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                                <Label>Tiempo</Label>
                                <Text category="h4">
                                    {`${lapse
                                        .hours()
                                        .toString()
                                        .padStart(
                                            2,
                                            0
                                        )}:${lapse
                                        .minutes()
                                        .toString()
                                        .padStart(2, 0)}`}
                                </Text>
                                <Text>
                                    Inicio: {displayStartTime.format('hh:mm')}
                                </Text>
                                <Text>
                                    Fin: {displayEndTime.format('hh:mm')}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Label>Costo</Label>
                                <Text category="h4">
                                    {currencyFormat(cost)}
                                </Text>
                            </View>
                        </Row>
                    )}
                </Layout>
            </Layout>
        </Layout>
    );
};

const StyledScreen = withStyles(RequestDetailScreen, (theme) => ({
    markerContainer: {
        alignItems: 'center',
        width: 50,
        backgroundColor: 'transparent',
        height: 50,
    },
    marker: {
        color: theme['color-danger-600'],
        size: 32,
    },
    map: { flex: 1, marginVertical: 10, height: 500 },
    carOption: {
        width: 121,
        height: 89,
        margin: 5,
    },
    materialButtonHamburger: {
        height: 102,
        width: 67,
        borderRadius: 10,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 30,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
}));

export default connect((state) => ({
    servicesTypes: state.serviceTypes,
    vehicleTypes: state.vehicleTypes,
    vehicles: state.vehicles.filter((v) => !v.disabled),
}))(StyledScreen);
