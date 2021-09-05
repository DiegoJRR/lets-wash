import { Icon, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Row } from '../common';

function Estrellas(props) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        if (i < props.rate) colors.push('#FFC94D');
        else colors.push('#C5CEE0');
    }
    return (
        <Row
            style={{
                paddingVertical: 5,
                justifyContent: 'flex-start',
            }}
        >
            <Text style={{ marginRight: 5, fontSize: 16 }}>
                {props.rate === 0 ? "N/A" : props.rate.toFixed(2)}
            </Text>
            <Icon
                name="star"
                style={{ width: 15, height: 15, marginRight: 4 }}
                fill="#FFC94D"
            />
        </Row>
    );
}

const styles = StyleSheet.create({});

export default Estrellas;
