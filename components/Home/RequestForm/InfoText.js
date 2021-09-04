import React from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

function InfoText(props) {
    return (
        <View style={[styles.container, props.style]}>
            <Text style={styles.text}>{props.text || 'InfoText'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    text: {
        fontFamily: 'inter-regular',
    },
});

export default InfoText;
