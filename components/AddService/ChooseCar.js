import React, {  } from 'react';
import {
    View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Icon, Button, Text, Card, useTheme } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

const selectedStyle = {
    shadowColor: '#FF0000',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
};

const ChooseVehicleView = (props) => {
    // const [selected, setSelected] = useState(props.selected);
    // const [editVehicle, setEditVehicle] = useState(props.editVehicle);
    const { vehicles, navigation, selected } = props;

    const theme = useTheme();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, margin: 10 }}>
                {vehicles.map((vehicle, idx) => {
                    return (
                        <Card
                            key={idx}
                            style={(() => {
                                let style = {
                                    borderRadius: 20,
                                    marginBottom: 5,
                                };
                                if (selected === vehicle.ref)
                                    style = { ...style, ...selectedStyle };
                                return style;
                            })()}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 0,
                                    alignItems: 'center',
                                }}
                            >
                                <FontAwesomeIcon
                                    name="car"
                                    style={{
                                        marginRight: 15,
                                        fontSize: 26,
                                        color: vehicle.color,
                                        textAlign: 'center',
                                    }}
                                ></FontAwesomeIcon>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        category="p1"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {vehicle.alias}
                                    </Text>
                                    <Text category="label">
                                        Marca: {vehicle.brand}
                                    </Text>
                                    <Text category="label">
                                        Modelo: {vehicle.model}
                                    </Text>
                                </View>
                                <Button
                                    onPress={() => {
                                        navigation.navigate('EditCarModal', {
                                            vehicle,
                                            userRequests: props.userRequests,
                                            vehicles,
                                        });
                                    }}
                                    appearance="ghost"
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 20,
                                    }}
                                    status="basic"
                                    accessoryLeft={(props) => (
                                        <Icon name="more-vertical" {...props} />
                                    )}
                                ></Button>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state) => {
    const { vehicles, userRequests } = state;
    return { vehicles: vehicles.filter((v) => !v.disabled), userRequests };
};

export default connect(mapStateToProps)(ChooseVehicleView);
