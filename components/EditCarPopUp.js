import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Card,
    Text,
    Input,
    Button,
    Select,
    SelectItem,
    useTheme,
    IndexPath,
} from '@ui-kitten/components';
import functions from '@react-native-firebase/functions';
import { connect } from 'react-redux';
import { Row } from '../common';
import { addVehicle } from '../redux/actions';

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

function EditCarPopUp(props) {
    const {
        onClose,
        vehicleTypes,
        vehicle,
        userRequests,
        vehicles,
        updateVehicles,
        cleanServices,
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
                if (request.cancelled == false && request.fulfilled == false) {
                    for (
                        let serviceIndex = 0;
                        serviceIndex < request.services.length;
                        serviceIndex++
                    ) {
                        const service = request.services[index];

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
            close();
        } else {
            // Call to cloud function
            functions()
                .httpsCallable('deleteVehicle')({
                    vehicleRef: vehicle.ref,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        var newVehicleList = new Array();
                        for (let index = 0; index < vehicles.length; index++) {
                            if (vehicles[index].ref != vehicle.ref) {
                                newVehicleList.push(vehicles[index]);
                            }
                        }

                        updateVehicles(newVehicleList);
                        cleanServices();
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
                    onClose();
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
                onClose();
            });
    };

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
            <Text category="h5" style={{ fontWeight: 'bold' }}>
                Editar vehículo
            </Text>
            <Icon
                onPress={onClose}
                name="times"
                style={{
                    fontSize: 24,
                    color: theme['background-alternative-color-1'],
                    textAlign: 'justify',
                }}
            ></Icon>
        </View>
    );

    return (
        <Card
            disabled={true}
            header={Header}
            style={{
                borderRadius: 20,
                borderColor: theme['color-primary-default-border'],
                borderWidth: 5,
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
                                setSelectedColor(color);
                            })(idx)}
                        >
                            <View
                                style={{
                                    width: 21,
                                    height: 21,
                                    backgroundColor: color,
                                    borderColor:
                                        theme['border-alternative-color-3'],
                                    borderRadius: 50,
                                    marginHorizontal: 3,
                                    borderWidth: idx == selectedColor ? 2 : 0,
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
            <Row>
                <Button
                    style={{ marginTop: 5 }}
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
                    style={{ marginTop: 5 }}
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
        </Card>
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
    const { vehicles, vehicleTypes } = state;
    return { vehicles, vehicleTypes };
};

export default connect(mapStateToProps, { addVehicle })(EditCarPopUp);
