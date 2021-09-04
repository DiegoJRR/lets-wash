import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Pressable, Animated, Keyboard } from 'react-native';
import {
    Card,
    Text,
    Input,
    Divider,
    useStyleSheet,
    StyleService,
    Icon,
    Button,
    Modal,
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import moment from 'moment';
import functions from '@react-native-firebase/functions';
import Collapsible from 'react-native-collapsible';
import { Label, currencyFormat } from '../../../common';
import { setRequestData } from '../../../redux/actions';
import { requestFormContext } from './RequestFormContext';

const ConfirmationField = (props) => (
    <Card
        style={[
            props.style,
            {
                marginVertical: 10,
            },
        ]}
    >
        <View style={{ margin: -8 }}>
            <Text category="label" appearance="hint">
                {props.title}
            </Text>
            <Text category="label">{props.text}</Text>
        </View>
    </Card>
);

const DropdownIcon = (props) => <Icon {...props} name="chevron-down-outline" />;

const themedStyles = StyleService.create({
    collapsedHeader: {
        padding: 10,
        paddingHorizontal: 20,
        height: 40,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    collabsible: {
        backgroundColor: 'background-basic-color-2',
    },
    centered: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    chevron: {
        fill: 'text-basic-color',
        width: 20,
        height: 20,
    },
    modalInput: {
        color: 'text-basic-color',
        flex: 1,
    },
    tipButton: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'border-basic-color-4',
        marginRight: 5,
        paddingHorizontal: 7,
    },
    unselectedTip: {
        backgroundColor: '#ffffff',
        color: '#352a29',
    },
    selectedTip: {
        backgroundColor: '#352a29',
        color: '#ffffff',
    },
});

const tipPresets = [0, 15, 20, 30];

const TipSelector = ({ tip, onAdd, inputStyle }) => {
    const [amount, setAmount] = useState(tip);
    return (
        <Card disabled>
            <Label style={{ marginBottom: 10 }}>Escribe un monto</Label>

            <Input
                style={inputStyle}
                value={`$ ${amount?.toString() ?? '0'}`}
                keyboardType="numeric"
                onChangeText={(value) => {
                    let validateNumber = parseInt(value.replace(/\D/g, ''));

                    if (validateNumber > 999) validateNumber = 999;
                    if (validateNumber < 0) validateNumber = 0;

                    validateNumber ? setAmount(validateNumber) : setAmount(0);
                }}
            />
            <Button
                onPress={() => onAdd(amount)}
                style={{ marginVertical: 10 }}
            >
                Agregar
            </Button>
        </Card>
    );
};

const Confirmation = (props) => {
    if (props.hidden) return null;
    const rfContext = useContext(requestFormContext);
    const [details, setDetails] = useState('');
    const [collapsed, setCollapsed] = useState(true);
    const collapseAnim = useRef(new Animated.Value(1)).current;
    const [uploading, setUploading] = useState(false);

    const [tip, setTip] = useState(15);
    const [customTip, setCustomTip] = useState([false, null]); // [uses custom tip, custom tip value]
    const [editTip, setEditTip] = useState(false);

    const styles = useStyleSheet(themedStyles);

    const { requestData, selectedAddress, active } = props;

    let durationMin = 0;
    for (let index = 0; index < props.services.length; index++) {
        const serviceObj = props.services[index];

        if (serviceObj.active) {
            const {service} = serviceObj;
            durationMin += service.durationMin;
        }
    }

    const Header = (props) => (
        <View
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

    useEffect(() => {
        if (collapsed) {
            Animated.timing(collapseAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(collapseAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [collapsed]);

    createRequest = () => {
        setUploading(true);

        rfContext.setAllowStep(false);

        const washer = requestData.employee.ref;

        const today = new Date();
        const startTime = Math.floor(
            requestData.date + today.getTimezoneOffset() / 60
        );
        let endTime = startTime;
        let servicesFactor = 1;
        const location = props.selectedAddress;

        const primes = [];

        props.services.forEach((service) => {
            endTime += service.service.durationMin * 60; 
            if (!primes.includes(service.service.prime)) {
                servicesFactor *= service.service.prime;
                primes.push(service.service.prime);
            }
        });

        const services = props.services.map((service) => ({
            ...service,
            service: service.service.ref,
        }));

        // Call firebase function
        functions()
            .httpsCallable('createRequest')({
                washer,
                startTime,
                endTime,
                servicesFactor,
                services,
                details,
                location,
                tip,
                shipping: props.comission,
            })
            .then((res) => {
                const requestId = res.data.message.ref;

                // Save to redux
                props.setRequestData({
                    ...requestData,
                    ref: requestId,
                    tip,
                    shipping: props.comission,
                });

                rfContext.setAllowStep(true);

                // Continue with request flow
                rfContext.next();

                setUploading(false);
            })
            .catch((err) => {
                console.log(err);
                console.log('Could not create the request!'); // TODO: Error handling

                rfContext.setAllowStep(true);
                setUploading(false);
            });
    };

    useEffect(() => {
        if (!active) {
            // props.setRequestData({ ...requestData, details });
        }
        if (active && !rfContext.allowStep) {
            rfContext.setAllowStep(true);
        }
        if (active) {
            rfContext.setFooterOptions({
                display: true,
                disabled: false,
                left: {
                    display: true,
                    text: 'Cancelar',
                },
                right: {
                    display: true,
                    text: 'Continuar',
                    action: () => {
                        Keyboard.dismiss();
                        createRequest();
                    },
                },
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

    return (
        <View
            style={{
                width: '100%',
                flex: 1,
            }}
        >
            <Header title="Confirmación" />
            <Divider />
            <View
                style={{
                    width: '100%',
                    flex: 1,
                    padding: 10,
                }}
            >
                <ScrollView>
                    <ConfirmationField
                        title="DIRECCIÓN"
                        text={
                            selectedAddress.main_text +
                            (selectedAddress.secondary_text.length > 0
                                ? `, ${selectedAddress.secondary_text}`
                                : '')
                        }
                    />
                    <ConfirmationField
                        title="FECHA Y HORA"
                        text={
                            `${moment
                                .unix(requestData.date)
                                .format('DD / MM / YYYY HH:mm') 
                            }  Duración: ${ 
                            durationMin.toString() 
                            } min`
                        }
                    />
                    <ConfirmationField
                        title="LAVADOR"
                        text={
                            `${requestData.employee.firstName 
                            } ${ 
                            requestData.employee.lastName}`
                        }
                    />
                    <Card style={{ marginVertical: 10 }}>
                        <Pressable
                            onPress={() => setCollapsed(!collapsed)}
                            style={{
                                marginHorizontal: 0,
                                paddingVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            rotate: collapseAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [
                                                    '0deg',
                                                    '-180deg',
                                                ],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <DropdownIcon
                                    fill={styles.chevron.fill}
                                    style={[styles.chevron]}
                                />
                            </Animated.View>
                            <Text category="label" appearance="hint">
                                VEHÍCULOS: {props.services.length}
                            </Text>
                        </Pressable>

                        <Collapsible collapsed={collapsed} style={[{}]}>
                            {props.services.map((el, idx) => {
                                if (!el) return null;
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            margin: 0,
                                        }}
                                        key={idx}
                                    >
                                        <ConfirmationField
                                            style={{ flex: 1, marginRight: 10 }}
                                            title="VEHÍCULO"
                                            text={el.vehicle.alias}
                                        />
                                        <ConfirmationField
                                            style={{ flex: 1 }}
                                            title="SERVICIO"
                                            text={el.service.name}
                                        />
                                    </View>
                                );
                            })}
                        </Collapsible>
                    </Card>
                    <View style={{ marginVertical: 10 }}>
                        <Label>Propina</Label>
                        <ScrollView
                            horizontal
                            style={{}}
                            contentContainerStyle={{
                                paddingVertical: 10,
                            }}
                        >
                            {tipPresets.map((value, index) => (
                                <Button
                                    size="small"
                                    key={index}
                                    status={
                                        value == tip && !customTip[0]
                                            ? 'info'
                                            : 'basic'
                                    }
                                    style={[
                                        styles.tipButton,
                                        {
                                            ...(value == tip && !customTip[0]
                                                ? styles.selectedTip
                                                : styles.unselectedTip),
                                        },
                                    ]}
                                    onPress={() => {
                                        setTip(value);
                                        setCustomTip([false, customTip[1]]);
                                    }}
                                >
                                    <Label
                                        style={
                                            value == tip && !customTip[0]
                                                ? styles.selectedTip
                                                : styles.unselectedTip
                                        }
                                    >
                                        {currencyFormat(value)}
                                    </Label>
                                </Button>
                            ))}
                            <Button
                                size="small"
                                status={customTip[0] ? 'primary' : 'basic'}
                                style={[
                                    styles.tipButton,
                                    {
                                        ...(customTip[0]
                                            ? styles.selectedTip
                                            : styles.unselectedTip),
                                    },
                                ]}
                                accessoryRight={(props) => (
                                    <Icon
                                        {...props}
                                        fill={
                                            (customTip[0]
                                                ? styles.selectedTip
                                                : styles.unselectedTip
                                            ).color
                                        }

                                        name="edit-outline"
                                    />
                                )}
                                onPress={() => setEditTip(true)}
                            >
                                <Label
                                    style={
                                        customTip[0]
                                            ? styles.selectedTip
                                            : styles.unselectedTip
                                    }
                                >
                                    {customTip[1]
                                        ? currencyFormat(customTip[1])
                                        : 'OTRO'}{' '}
                                </Label>
                            </Button>
                        </ScrollView>
                    </View>
                    <Input
                        multiline
                        value={details}
                        disabled={uploading}
                        onChangeText={setDetails}
                        textStyle={{
                            minHeight: 128,
                            textAlignVertical: 'top',
                        }}
                        label="Comentarios"
                        placeholder="Agrega tus comentarios o instrucciones."
                    />
                </ScrollView>
            </View>
            <Divider />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    padding: 10,
                }}
            >
                <View
                    style={{
                        alignItems: 'flex-end',
                    }}
                >
                    <Text category="label">
                        Subtotal:{' '}
                        {currencyFormat(
                            props.services.reduce((acc, curr) => (
                                    curr.service.fees.find((fee) => fee.type == curr.vehicle.type).cost + acc
                                ), 0)
                        )}
                    </Text>
                    <Text category="label">
                        Envío: {currencyFormat(props.comission)}
                    </Text>
                    <Text category="label">Propina: {currencyFormat(tip)}</Text>
                    <Text category="h5" style={{ fontWeight: 'bold' }}>
                        Total:{' '}
                        {currencyFormat(
                            props.services.reduce((acc, curr) => (
                                    curr.service.fees.find((fee) => fee.type == curr.vehicle.type).cost + acc
                                ), 0) +
                                props.comission +
                                tip
                        )}
                    </Text>
                </View>
            </View>
            <Modal
                visible={editTip}
                backdropStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onBackdropPress={() => setEditTip(false)}
            >
                <TipSelector
                    tip={customTip[1]}
                    onAdd={(value) => {
                        if (value) {
                            setCustomTip([true, value]);
                            setTip(value);
                        }
                        setEditTip(false);
                    }}
                    inputStyle={styles.modalInput}
                />
            </Modal>
        </View>
    );
};

const mapStateToProps = (state) => {
    const {
        vehicles,
        services,
        requestData,
        selectedAddress,
        comission,
    } = state;
    return {
        vehicles,
        services: services.filter((s) => s.active),
        requestData,
        selectedAddress,
        comission,
    };
};

export default connect(mapStateToProps, { setRequestData })(Confirmation);
