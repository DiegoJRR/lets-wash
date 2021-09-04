import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Button,
    Text,
    Divider,
    useTheme,
} from '@ui-kitten/components';
import { connect, useSelector } from 'react-redux';
import moment from 'moment';
import { Row, currencyFormat } from '../../../common';
import { requestFormContext } from './RequestFormContext';
import ResumenDeServicio from './ResumenDeServicio';

const LabelField = (props) => (
        <View
            {...props}
            style={{
                flex: 1,
                paddingVertical: 4,
            }}
        >
            <Text
                appearance="hint"
                category="label"
                style={{
                    textTransform: 'uppercase',
                }}
            >
                {props.label}
            </Text>
            <Text>{props.text}</Text>
        </View>
    );

function ResumenComponent(props) {
    const rfContext = useContext(requestFormContext);
    const { services, active } = props;
    const theme = useTheme();
    const { requestData, selectedAddress, comission, tip } = useSelector(
        (state) => ({
            requestData: state.requestData,
            selectedAddress: state.selectedAddress,
            comission: state.comission,
            tip: state.requestData.tip,
        })
    );

    useEffect(() => {
        if (active && !rfContext.allowStep) {
            rfContext.setAllowStep(true);
        }
        if (active) {
            rfContext.setFooterOptions({
                display: false,
            });
        }
    }, [active]);

    if (!props.render)
        return (
            <View
                style={{
                    width: '100%',
                    flex: 1,
                }}
             />
        );

    const subtotal = props.services.reduce(
        (acc, curr) => {
            const cost = curr.service
                ? curr.service.fees.find((fee) => fee.type == curr.vehicle.type)
                      .cost
                : 0;
            return !curr ? acc : acc + cost;
        },

        0
    );

    return (
        <View
            style={{
                flex: 1,
                width: '100%',
            }}
        >
            <Text
                category="h3"
                style={{
                    fontWeight: 'bold',
                    margin: 10,
                    alignSelf: 'center',
                }}
            >
                Resumen
            </Text>
            <Divider />
            <View
                style={{
                    flex: 1,
                    padding: 10,
                }}
            >
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <Row>
                        <LabelField
                            label="Dirección"
                            text={selectedAddress.main_text}
                        />
                        <LabelField
                            label="Fecha"
                            text={moment
                                .unix(requestData.date)
                                .format('DD / MM / YYYY HH:MM')}
                        />
                    </Row>
                    <Row>
                        <LabelField
                            label="Lavador"
                            text={
                                requestData.employee.displayName ??
                                `${requestData.employee.firstName 
                                } ${ 
                                requestData.employee.lastName}`
                            }
                        />
                    </Row>
                    <View
                        style={{
                            marginVertical: 5,
                            flex: 1,
                        }}
                    >
                        <Row style={{}}>
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    VEHÍCULO
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    COSTO
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    SERVICIO
                                </Text>
                            </View>
                        </Row>

                        {services.map((el, idx) => {
                            if (!el) return null;
                            return (
                                <ResumenDeServicio
                                    key={idx}
                                    service={el.service}
                                    vehicle={el.vehicle}
                                 />
                            );
                        })}
                    </View>
                    <View>
                        <Row
                            style={{
                                marginVertical: 2,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    Subtotal
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 1 }}>
                                <Text category="label">
                                    {currencyFormat(subtotal)}
                                </Text>
                            </View>
                        </Row>
                        <Row
                            style={{
                                marginVertical: 2,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    Envío
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 1 }}>
                                <Text category="label">
                                    {currencyFormat(comission)}
                                </Text>
                            </View>
                        </Row>
                        <Row
                            style={{
                                marginVertical: 2,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text category="label" appearance="hint">
                                    Propina
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 1 }}>
                                <Text category="label">
                                    {currencyFormat(tip)}
                                </Text>
                            </View>
                        </Row>
                        <Row>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    TOTAL
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 1 }}>
                                <Text>
                                    {currencyFormat(comission + subtotal + tip)}
                                </Text>
                            </View>
                        </Row>
                    </View>
                </ScrollView>
            </View>
            <Divider />
            <View
                style={{
                    padding: 15,
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Text
                    category="h4"
                    style={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                    Su solicitud se realizó con éxito
                </Text>
                <Icon
                    name="ios-checkmark-circle-outline"
                    style={{
                        ...styles.icon,
                        color: theme['text-basic-color'],
                    }}
                 />
                <Text
                    category="label"
                    style={{
                        padding: 5,
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    Puedes consultar los detalles y el estado de tu solicitud en
                    la ventana de solicitudes.
                </Text>
                <Button onPress={() => props.onClose()} appearance="ghost">
                    <Text style={{ fontWeight: 'bold' }}>Continuar</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 83,
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 0,
    },
});

const mapStateToProps = (state) => {
    const { vehicles, services } = state;
    return { vehicles, services: services.filter((s) => s.active) };
};

export default connect(mapStateToProps)(ResumenComponent);
