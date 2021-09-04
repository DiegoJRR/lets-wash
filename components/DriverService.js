import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Text,
    Card,
} from '@ui-kitten/components';

function DriverService({ title, text }) {
    return (
        <Card
            disabled={true}
            style={{
                borderRadius: 20,
                marginBottom: 10,
            }}
        >
            <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            <Text
                style={{
                    paddingVertical: 10,
                }}
            >
                {text}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,1)',
        borderRadius: 27,
    },
    group: {
        height: 87,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    tipoA: {
        fontFamily: 'roboto-700',
        color: '#121212',
        fontSize: 16,
        alignSelf: 'flex-start',
        marginRight: 14,
        marginLeft: 14,
        marginTop: 0,
        marginBottom: 0,
    },
    loremIpsum: {
        fontFamily: 'roboto-regular',
        color: '#121212',
        height: 39,
        textAlign: 'left',
        fontSize: 10,
        alignSelf: 'stretch',
        marginRight: 14,
        marginLeft: 14,
        marginTop: 0,
        marginBottom: 0,
    },
    xxXxMxn: {
        fontFamily: 'roboto-700',
        color: '#121212',
        fontSize: 20,
        height: 24,
        textAlign: 'right',
        alignSelf: 'flex-end',
        marginRight: 14,
        marginLeft: 14,
        marginTop: 0,
        marginBottom: 0,
    },
});

export default DriverService;
