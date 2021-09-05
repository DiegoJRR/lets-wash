import React from 'react';
import {
    View,
} from 'react-native';
import { Text, Layout, useTheme } from '@ui-kitten/components';

export function currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const Row = (props) => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...props.style,
        }}
    >
        {props.children}
    </View>
);

export const PageHeader = (props) => {
    const LeftButton = props.leftButton;
    const RightButton = props.rightButton;
    const theme = useTheme();

    return (
        <Layout
            style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {LeftButton ? <LeftButton /> : null}
            <Text
                category={props.category || 'h1'}
                style={{
                    color: theme['text-basic-color'],
                    fontWeight: 'bold',
                    flex: 1,
                }}
            >
                {props.text}
            </Text>
            {RightButton ? <RightButton /> : null}
        </Layout>
    );
};

export const Label = (props) => (
    <Text
        category="label"
        status={props.status || 'basic'}
        style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            ...props.style,
        }}
    >
        {props.children}
    </Text>
);

export const DataItem = (props) => (
    <View style={{ paddingVertical: 5, ...props.style }}>
        <Label>{props.label}</Label>
        {props.textComponent ? (
            <props.textComponent />
        ) : (
            <Text>{props.text}</Text>
        )}
    </View>
);

export const VehicleServiceRow = (props) => {
    const { vehicleType, brand, color, serviceType } = props;
    return (
        <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
                <DataItem label="Servicio" text={serviceType} />
            </View>
            <View style={{ flex: 1 }}>
                <DataItem
                    label="Vehículo"
                    textComponent={() => (
                        <View>
                            <Row>
                                <Text appearance="hint" style={{marginRight: 10}}>Tipo</Text>
                                <Text numberOfLines={2} style={{flex: 1}}>{vehicleType}</Text>
                            </Row>
                            <Row>
                                <Text appearance="hint">Marca</Text>
                                <Text>{brand}</Text>
                            </Row>
                            <Row style={{marginRight: 10}}>
                                <Text appearance="hint" style={{marginRight: 10}}>Modelo</Text>
                                <Text numberOfLines={2} style={{flex: 1}}>Mitsubishi</Text>
                            </Row>
                            <Row>
                                <Text appearance="hint" style={{ flex: 1 }}>
                                    Color
                                </Text>
                                <View
                                    style={{
                                        height: 10,
                                        backgroundColor: color,
                                        flex: 1,
                                    }}
                                />
                            </Row>
                        </View>
                    )}
                />
            </View>
        </Row>
    );
};

export const truncateString = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
};
