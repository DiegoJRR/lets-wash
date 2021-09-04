import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
    Card,
    Text,
    Divider,
    useTheme,
    RadioGroup,
    Radio,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import functions from '@react-native-firebase/functions';
import { requestFormContext } from './RequestFormContext';
// import { createCheckout } from "../../Payments/Payments";
import { addService, removeService } from '../../../redux/actions';

const ErrorToaster = (props) => {
    const theme = useTheme();
    return (
        <Card
            style={{
                margin: 10,
                backgroundColor: theme['color-danger-400'],
                borderColor: theme['color-danger-500'],
            }}
        >
            <Text style={{ color: theme['color-danger-100'] }}>
                Ocurrió un error al procesar su pago. Intente de nuevo o use
                otro método.
            </Text>
            {props.details ? (
                <Text style={{ color: theme['color-danger-100'] }}>
                    {props.details}
                </Text>
            ) : null}
        </Card>
    );
};

const PaymentMethodSelection = (props) => {
    const context = useContext(requestFormContext);
    const navigation = useNavigation();
    const theme = useTheme();
    if (props.hidden) return null;
    const [paymentResult, setPaymentResult] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentOption, setPaymentOption] = useState(null);
    const [loading, setLoading] = useState(null);
    const { services, active, userData, requestData } = props;
    const tip = requestData.tip;
    const shipping = requestData.shipping;

    const checkAllowStep = () => {
        if (!active) return;
        if (
            (services.length == 0 ||
                services.filter((sv) => !sv.service).length > 0 ||
                paymentOption == null) &&
            context.allowStep
        ) {
            context.setAllowStep(false);
        } else if (
            services.length > 0 &&
            services.filter((sv) => !sv.service).length == 0 &&
            paymentOption != null &&
            !context.allowStep
        ) {
            context.setAllowStep(true);
        }
    };

    useEffect(() => {
        checkAllowStep();
        if (active) {
            context.setFooterOptions({
                right: {
                    display: true,
                    text: 'Pagar',
                    action: checkout,
                },
            });
        }
    }, [active, paymentOption]);

    useEffect(() => {
        checkAllowStep();
    }, []);

    const checkout = () => {
        if (paymentOption == 0) {
            setLoading(true);
            context.setFooterOptions({
                disabled: true,
            });
            createCheckout(services, {
                email: userData.email,
                name: userData.firstName,
                surname: userData.lastName,
            }, tip, shipping)
                .then((result) => {
                    setLoading(false);
                    context.setFooterOptions({
                        disabled: false,
                    });
                    setPaymentResult(result);

                    if (result.status == 'approved') {
                        // Update the request with the payment information
                        functions()
                            .httpsCallable('updateRequestPayment')({
                                requestRef: requestData.ref,
                                paymentType: result.paymentMethodId,
                                paymentId: result.id,
                            })
                            .then((res) => {
                                if (res.data.status === 200) {
                                    setPaymentError(null);
                                } else {
                                    // Notificar al administrador del problema
                                    console.log(res.data.message);
                                    setPaymentError(res.data.message);
                                }
                            })
                            .catch((err) => {
                                // Notificar al administrador del problema
                                console.log(err);
                                setPaymentError(err);
                            });

                        // TODO: Notificar al administrador si es que no se puede actualizar la request con el metodo de pago
                        // Esto es muy improbable de que pase, porque nos aseguramos de crear la request desde antes, pero vale la pena considerar el caso
                        context.next();
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    context.setFooterOptions({
                        disabled: false,
                    });
                    setPaymentError(err);
                });
        } else {
            // Update the request with the payment information
            functions()
                .httpsCallable('updateRequestPayment')({
                    requestRef: requestData.ref,
                    paymentType: 'cash',
                    paymentId: '',
                })
                .then((res) => {
                    if (res.data.status === 200) {
                        context.next();
                    } else {
                        // Notificar al administrador del problema
                        console.log(res.data.message);
                    }
                })
                .catch((err) => {
                    // Notificar al administrador del problema
                    console.log(err);
                });

            context.next();
        }
    };

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
            <Header title={'Selecciona un método de pago'} />
            <Divider></Divider>
            <View
                style={{
                    padding: 16,
                    flex: 1,
                }}
            >
                <RadioGroup
                    selectedIndex={paymentOption}
                    onChange={setPaymentOption}
                >
                    {/* <Radio status="primary" disabled={loading}>
                        💳 Tarjeta de crédito / débito
                    </Radio> */}
                    <Radio status="primary" disabled={loading}>
                        💵 Efectivo
                    </Radio>
                </RadioGroup>
            </View>
            {paymentError ? <ErrorToaster /> : null}
        </View>
    );
};

const mapStateToProps = (state) => {
    const { vehicles, services, vehicleTypes, userData, requestData } = state;
    return {
        vehicles,
        services: services.filter((s) => s.active),
        vehicleTypes,
        userData,
        requestData,
    };
};

export default connect(mapStateToProps, { addService, removeService })(
    PaymentMethodSelection
);
