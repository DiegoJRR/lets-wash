import React, { useState } from 'react';
import { View } from 'react-native';
import {
    Text,
    TopNavigation,
    Card,
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { currencyFormat } from '../../common';


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

const ChooseServiceView = (props) => {
    const [selected, setSelected] = useState(null);
    const { serviceTypes, vehicleType } = props;

    return (
        <View style={{ flex: 1 }}>
            <TopNavigation
                title={(props) => (
                    <Text category="h6" style={{ fontWeight: 'bold' }}>
                        Agrega un servicio
                    </Text>
                )}
            />
            {serviceTypes.map((service, idx) => (
                <Card
                    key={idx}
                    style={(() => {
                        let style = { margin: 10, borderRadius: 20 };
                        if (selected === service.ref)
                            style = { ...style, ...selectedStyle };
                        return style;
                    })()}
                    onPress={() => {
                        setSelected(service.ref);
                        props.onChoose(service);
                    }}
                >
                    <Text category="p1" style={{ fontWeight: 'bold' }}>
                        {service.name}
                    </Text>
                    <Text category="p1">
                        {service.description}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text>
                            {currencyFormat(
                                service?.fees?.find((fee) => {
                                    return fee.type == vehicleType;
                                })?.cost || 0
                            )}
                        </Text>
                        <Text category="p1"> Duración: {service?.durationMin} min</Text>
                    </View>
                </Card>
            ))}
        </View>
    );
};

export default connect((state) => ({ serviceTypes: state.serviceTypes }))(
    ChooseServiceView
);
