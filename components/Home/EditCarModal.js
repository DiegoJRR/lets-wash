import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Icon as KittenIcon,
    Input,
    Button,
    Select,
    SelectItem,
    useTheme,
    IndexPath,
    Layout,
    TopNavigation,
    TopNavigationAction,
    Divider,
} from '@ui-kitten/components';
import functions from '@react-native-firebase/functions';
import { connect } from 'react-redux';
import { Row } from '../../common';
import { addVehicle, cleanServices, setVehicles } from '../../redux/actions';

const colors = [
    '#dddddd',
    '#a9a9a9',
    '#000000',
    '#800000',
    '#9A6324',
    '#808000',
    '#469990',
    '#e6194B',
    '#f58231',
    '#ffe119',
    '#bfef45',
    '#3cb44b',
    '#4363d8',
    '#911eb4',
];

const { max } = Math;

const BackIcon = (props) => <KittenIcon {...props} name="arrow-back" />;

function EditCarModal(props) {
    const { vehicle } = props.route.params;

    const {
        vehicleTypes,
        userRequests,
        vehicles,
        setVehicles: updateVehicles,
        cleanServices,
        navigation,
    } = props;
    const theme = useTheme();
    const [alias, setAlias] = useState(vehicle.alias);
    const [model, setModel] = useState(vehicle.model);
    const [brand, setBrand] = useState(vehicle.brand);
    const [plate, setPlate] = useState(vehicle.plate);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(
        max(
            colors.findIndex((color) => color == vehicle.color),
            0
        )
    );
    const [type, setType] = useState(
        vehicle.type
            ? new IndexPath(
                  vehicleTypes.findIndex((vt) => vt.ref == vehicle.type)
              )
            : new IndexPath(0)
    );

    const deleteVehicle = () => {
        setUploading(true);
        var inUse = false;
        // Check if the car is being used in an unfulfilled request
        for (let index = 0; index < userRequests.length; index++) {
            const request = userRequests[index];

            if (!(request === undefined)) {
                if (
                    request.cancelled == false &&
                    request.fulfilled == false &&
                    (request.paid || request.payment.type == 'cash')
                ) {
                    for (
                        let serviceIndex = 0;
                        serviceIndex < request.services.length;
                        serviceIndex++
                    ) {
                        const service = request.services[serviceIndex];

                        if (service.vehicle == vehicle.ref) {
                            inUse = true;
                        }
                    }
                }
            }
        }

        if (inUse) {
            Alert.alert(
                'No se puede eliminar el auto',
                'Este carro es parte de una solicitud de servicio que sigue activa. Intente esperar a que termine la solicitud para borrarlo.',
                [
                    {
                        text: 'OK',
                        style: 'cancel',
                    },
                ],
                { cancelable: true }
            );

            setUploading(false);
            navigation.goBack();
        } else {
            ('HOLD THGE FSDAF');
            // Call to cloud function
            functions()
                .httpsCallable('deleteVehicle')({
                    vehicleRef: vehicle.ref,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        var newVehicleList = vehicles.map((v) =>
                            v.ref == vehicle.ref ? { ...v, disabled: true } : v
                        );

                        updateVehicles(newVehicleList);
                        cleanServices();
                        navigation.goBack();
                    } else {
                        Alert.alert(
                            'No se puede eliminar el auto',
                            'Intentelo más tarde.',
                            [
                                {
                                    text: 'OK',
                                    style: 'cancel',
                                },
                            ],
                            { cancelable: true }
                        );
                    }
                })
                .catch((err) => {
                    Alert.alert(
                        'No se puede eliminar el auto',
                        'Intentelo más tarde.',
                        [
                            {
                                text: 'OK',
                                style: 'cancel',
                            },
                        ],
                        { cancelable: true }
                    );
                })
                .finally(() => {
                    setUploading(false);
                    navigation.goBack();
                });
        }
    };

    const saveEditedVehicle = () => {
        setUploading(true);
        // TODO: Handle change of car type for ongoing requests

        let newCarData = {
            vehicleRef: vehicle.ref,
            alias: alias,
            model: model,
            type: vehicleTypes[type.row].ref,
            brand: brand,
            color: colors[selectedColor],
            plate: plate,
        };

        // Call to cloud function
        functions()
            .httpsCallable('updateVehicle')({
                ...newCarData,
            })
            .then((res) => {
                var newVehicleList = new Array();
                for (let index = 0; index < vehicles.length; index++) {
                    if (vehicles[index].ref != vehicle.ref) {
                        newVehicleList.push(vehicles[index]);
                    } else {
                        newVehicleList.push({
                            ref: newCarData.vehicleRef,
                            ...newCarData,
                        });
                    }
                }

                updateVehicles(newVehicleList);
                cleanServices();
            })
            .catch((err) => {
                console.log(err);
                Alert.alert(
                    'No se puede editar el auto',
                    'Intentelo más tarde.',
                    [
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ],
                    { cancelable: true }
                );
            })
            .finally(() => {
                setUploading(false);
                navigation.goBack();
            });
    };

    const BackAction = () => (
        <TopNavigationAction
            onPress={() => navigation.goBack()}
            icon={BackIcon}
        />
    );

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigation
                title="Editar vehículo"
                style={{
                    backgroundColor: 'transparent',
                    borderBottomColor: theme['border-basic-color-3'],
                    borderBottomWidth: 1,
                }}
                accessoryLeft={BackAction}
            />
            <Layout style={{ flex: 1 }}>
                <Layout style={{ flex: 1 }}>
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                        contentContainerStyle={{
                            padding: 20,
                        }}
                    >
                        <Icon
                            name="car"
                            style={{
                                margin: 10,
                                fontSize: 45,
                                color: colors[selectedColor],
                                textAlign: 'center',
                            }}
                        ></Icon>
                        <View style={{ ...styles.scrollArea }}>
                            <ScrollView
                                horizontal={true}
                                contentContainerStyle={
                                    styles.scrollArea_contentContainerStyle
                                }
                            >
                                {colors.map((color, idx) => (
                                    <Pressable
                                        disabled={!editing || uploading}
                                        key={idx}
                                        onPress={((color) => () => {
                                            console.log(color);
                                            setSelectedColor(color);
                                        })(idx)}
                                    >
                                        <View
                                            style={{
                                                width: 21,
                                                height: 21,
                                                backgroundColor: color,
                                                borderColor:
                                                    theme[
                                                        'border-alternative-color-3'
                                                    ],
                                                borderRadius: 50,
                                                marginHorizontal: 3,
                                                borderWidth:
                                                    idx == selectedColor
                                                        ? 2
                                                        : 0,
                                            }}
                                        ></View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                        <Input
                            disabled={!editing || uploading}
                            value={alias}
                            onChangeText={(value) => setAlias(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Alias"
                        />
                        <Input
                            disabled={!editing || uploading}
                            value={model}
                            onChangeText={(value) => setModel(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Marca"
                        />
                        <Input
                            disabled={!editing || uploading}
                            value={brand}
                            onChangeText={(value) => setBrand(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Modelo"
                        />
                        <Input
                            disabled={!editing || uploading}
                            value={plate}
                            onChangeText={(value) => setPlate(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Placas"
                        />
                        <Select
                            disabled={!editing || uploading}
                            style={{ marginVertical: 5 }}
                            placeholder="Tipo de auto"
                            value={type ? vehicleTypes[type.row].name : null}
                            selectedIndex={type}
                            onSelect={(index) => {
                                setType(index);
                            }}
                        >
                            {vehicleTypes.map((vt, idx) => (
                                <SelectItem key={idx} title={vt.name} />
                            ))}
                        </Select>
                    </ScrollView>
                </Layout>
                <Divider />
                <Row
                    style={{
                        padding: 10,
                    }}
                >
                    <Button
                        appearance="ghost"
                        status={editing ? 'danger' : 'primary'}
                        disabled={uploading}
                        onPress={() => {
                            if (editing) {
                                setEditing(false);
                            } else {
                                setEditing(true);
                            }
                        }}
                        accessoryLeft={() => {
                            return null;
                        }}
                    >
                        {editing ? 'Cancelar' : 'Editar'}
                    </Button>
                    <Button
                        appearance="ghost"
                        onPress={() => {
                            if (editing) {
                                saveEditedVehicle();
                            } else {
                                deleteVehicle();
                            }
                        }}
                        disabled={uploading}
                        status={editing ? 'success' : 'danger'}
                        accessoryLeft={() => {
                            return null;
                        }}
                    >
                        {editing ? 'Guardar' : 'Borrar'}
                    </Button>
                </Row>
            </Layout>
        </Layout>
    );
}
const styles = StyleSheet.create({
    textInput: {
        height: 44,
        marginTop: 73,
        marginLeft: 14,
        marginRight: 17,
    },
    scrollArea: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 15,
    },
    scrollArea_contentContainerStyle: {
        width: 'auto',
        marginVertical: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
    },
});

const mapStateToProps = (state) => {
    const { vehicles, vehicleTypes, userRequests } = state;
    return { vehicles, vehicleTypes, userRequests };
};

export default connect(mapStateToProps, {
    addVehicle,
    cleanServices,
    setVehicles,
})(EditCarModal);
