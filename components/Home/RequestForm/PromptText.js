import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

function PromptText(props) {
    return (
        <View style={[styles.container, props.style]}>
            <Text category="label" appearance="hint">
                {props.text?.toUpperCase()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    text: {
        fontFamily: 'inter-regular',
        color: 'rgba(155,155,155,1)',
    },
});

export default PromptText;
