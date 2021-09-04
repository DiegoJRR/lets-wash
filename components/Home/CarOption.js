import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Icon, useTheme } from '@ui-kitten/components';
import { Row } from '../../common';

function CarOption(props) {
    const theme = useTheme();
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                marginRight: 10,
                justifyContent: 'center',
                backgroundColor: theme['background-basic-color-1'],
                padding: 0,
                borderRadius: 20,
                overflow: 'hidden',
                borderColor: props.selected
                    ? theme['border-primary-color-1']
                    : 'transparent',
                borderWidth: 2,
            }}
        >
            <Row
                style={{
                    height: '100%',
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        height: '100%',
                        padding: 15,
                        alignItems: 'center',
                        width: 75,
                    }}
                >
                    <FontAwesomeIcon
                        size={26}
                        name={props.icon2 || 'car'}
                        style={{ color: props.color }}
                    ></FontAwesomeIcon>
                    <Text
                        style={{
                            color: theme['text-basic-color'],
                            marginTop: 5,
                        }}
                        numberOfLines={2}
                    >
                        {props.alias || 'Auto 1'}
                    </Text>
                </View>
                <Pressable
                    onPress={props.onMenuPress}
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme['background-basic-color-2'],
                    }}
                >
                    <Icon
                        name="more-vertical"
                        fill={theme['text-basic-color']}
                        style={{ width: 30, height: 30 }}
                    />
                </Pressable>
            </Row>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
    button2: {
        top: 0,
        left: 0,
        width: 93,
        height: 89,
        position: 'absolute',
        backgroundColor: '#F7F9FC',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    icon2: {
        // fontSize: 45,
        // height: 45,
        // color: 'rgba(208,2,27,1)',
        // width: 52,
        // marginTop: 12,
        // marginLeft: 20,
    },
    auto1: {
        fontFamily: 'roboto-regular',
        color: '#121212',
        fontSize: 12,
        height: 14,
        width: 35,
        marginTop: 6,
        marginLeft: 28,
    },
    icon: {
        top: 28,
        left: 91,
        position: 'absolute',
        color: 'rgba(128,128,128,1)',
        fontSize: 30,
    },
    button2Stack: {
        backgroundColor: '#F7F9FC',
        borderRadius: 20,
        top: 0,
        left: 0,
        width: 121,
        height: 89,
        position: 'absolute',
    },
    button: {
        top: 0,
        left: 93,
        width: 28,
        height: 89,
        position: 'absolute',
        // backgroundColor: 'rgba(213,213,213,1)',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'visible',
    },
    button2StackStack: {
        top: 0,
        left: 0,
        width: 121,
        height: 89,
        position: 'absolute',
    },
    rect: {},
});

export default CarOption;
