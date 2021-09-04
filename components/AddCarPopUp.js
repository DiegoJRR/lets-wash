import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Card,
    Text,
    Input,
    Button,
    Select,
    SelectItem,
    useTheme,
    Spinner,
} from '@ui-kitten/components';
import functions from '@react-native-firebase/functions';
import { connect } from 'react-redux';
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

function AddCarPopUp(props) {
    const { onClose, vehicleTypes } = props;
    const theme = useTheme();
    const [selectedColor, setSelectedColor] = useState(0);
    const [alias, setAlias] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [plate, setPlate] = useState('');
    const [type, setType] = useState();
    const [adding, setAdding] = useState(false);

    const AddCar = () => {
        if (alias != '' && model != '' && brand != '' && type) {
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
                    onClose();
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
                Añadir un vehiculo
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
            <Button
                style={{ marginTop: 5 }}
                onPress={AddCar}
                disabled={adding}
                accessoryLeft={() => {
                    if (adding) return <Spinner />;
                    else return null;
                }}
            >
                {adding ? null : 'Añadir'}
            </Button>
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

export default connect(mapStateToProps, { addVehicle })(AddCarPopUp);
