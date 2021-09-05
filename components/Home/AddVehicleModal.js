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
    Layout,
    TopNavigation,
    TopNavigationAction,
    Divider,
    Spinner,
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

function AddVehicleModal(props) {
    // const { vehicle } = props.route.params;

    const {
        vehicleTypes,
        userRequests,
        vehicles,
        setVehicles: updateVehicles,
        cleanServices,
        navigation,
    } = props;
    const theme = useTheme();
    const [selectedColor, setSelectedColor] = useState(0);
    const [alias, setAlias] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [plate, setPlate] = useState('');
    const [type, setType] = useState();
    const [adding, setAdding] = useState(false);

    const AddCar = () => {
        if (alias !== '' && model !== '' && brand !== '' && type) {
            setAdding(true);

            functions()
                .httpsCallable('createVehicle')({
                    alias,
                    brand,
                    model,
                    type: vehicleTypes[type.row].ref,
                    color: colors[selectedColor],
                    plate,
                })
                .then((res) => {
                    setAdding(false);
                    props.addVehicle({
                        ref: res.data.message.ref,
                        alias,
                        brand,
                        model,
                        type: vehicleTypes[type.row].ref,
                        color: colors[selectedColor],
                        plates: plate,
                    });
                    navigation.goBack();
                })
                .catch((err) => {
                    setAdding(false);
                    console.warn(err);
                });
        } else {
            Alert.alert(
                'Datos faltantes',
                'Por favor ingrese todos los datos antes de crear el carro.',
                [
                    {
                        text: 'OK',
                        style: 'cancel',
                    },
                ],
                { cancelable: true }
            );
        }
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
                title="Agregar vehículo"
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
                                                    theme[
                                                        'border-alternative-color-3'
                                                    ],
                                                borderRadius: 50,
                                                marginHorizontal: 3,
                                                borderWidth:
                                                    idx === selectedColor
                                                        ? 2
                                                        : 0,
                                            }}
                                        />
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                        <Input
                            disabled={adding}
                            value={alias}
                            onChangeText={(value) => setAlias(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Alias"
                        />
                        <Input
                            disabled={adding}
                            value={model}
                            onChangeText={(value) => setModel(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Marca"
                        />
                        <Input
                            disabled={adding}
                            value={brand}
                            onChangeText={(value) => setBrand(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Modelo"
                        />
                        <Input
                            disabled={adding}
                            value={plate}
                            onChangeText={(value) => setPlate(value)}
                            style={{ marginTop: 5 }}
                            placeholder="Placas"
                        />
                        <Select
                            disabled={adding}
                            style={{ marginVertical: 5 }}
                            placeholder="Tipo de auto"
                            value={type ? vehicleTypes[type.row].name : null}
                            selectedIndex={type}
                            onSelect={(index) => setType(index)}
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
                        status="danger"
                        onPress={() => {
                            navigation.goBack();
                        }}
                        accessoryLeft={() => {
                            return null;
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        appearance="ghost"
                        onPress={AddCar}
                        disabled={adding}
                        accessoryLeft={() => {
                            if (adding) return <Spinner />;
                            else return null;
                        }}
                    >
                        {adding ? null : 'Añadir'}
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
})(AddVehicleModal);
