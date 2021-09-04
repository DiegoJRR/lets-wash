import { Divider, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { currencyFormat } from '../../../common';

function ResumenDeServicio(props) {
    const { vehicle, service } = props;
    const { serviceTypes } = useSelector((state) => ({
        serviceTypes: state.serviceTypes,
    }));
    const cost = service
        ? service.fees.find((fee) => fee.type == vehicle.type).cost
        : 0;
        
    return (
        <View style={{}}>
            <View
                style={{
                    flexDirection: 'row',
                    margin: 0,
                    alignItems: 'flex-start',
                    paddingVertical: 2,
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text>{vehicle.alias}</Text>
                    <Text>{vehicle.brand + ', ' + vehicle.model}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text>{service.name}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text>{currencyFormat(cost)}</Text>
                </View>
            </View>
            <Divider />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        borderColor: 'rgba(155,155,155,1)',
        borderBottomWidth: 1,
    },
    group: {
        backgroundColor: 'red',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 1,
    },
    infoVehiculo: {
        flex: 1,
        alignSelf: 'stretch',
    },
    infoText: {
        flex: 1,
        alignSelf: 'stretch',
    },
    infoText2: {
        alignSelf: 'stretch',
        flex: 1,
    },
    infoText3: {
        alignSelf: 'stretch',
        flex: 1,
    },
    infoServicio: {
        flex: 1,
        alignSelf: 'stretch',
    },
    infoText4: {
        flex: 1,
    },
    infoCosto: {
        flex: 1,
        alignSelf: 'stretch',
    },
    infoText5: {
        flex: 1,
    },
});

export default ResumenDeServicio;
