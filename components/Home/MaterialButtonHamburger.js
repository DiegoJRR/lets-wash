import { useStyleSheet, StyleService } from '@ui-kitten/components';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

function MaterialButtonHamburger(props) {
    const styles = useStyleSheet(themedStyles);
    return (
        <TouchableOpacity
            style={[styles.container, props.style]}
            onPress={props.onPress}
        >
            <Icon
                name={props.caption || 'menu'}
                style={[
                    styles.caption,
                    {
                        position: 'absolute',
                        fontSize: 24,
                        transform: [{ translateX: 12 }, { translateY: -15 }],
                    },
                ]}
             />

            <FontAwesomeIcon
                name="car"
                style={[
                    styles.caption,
                    {
                        transform: [{ translateX: -2 }],
                    },
                ]}
             />
        </TouchableOpacity>
    );
}

const themedStyles = StyleService.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 2,
        backgroundColor: 'background-basic-color-1',
    },
    caption: {
        color: 'text-basic-color',
        fontSize: 24,
    },
});

export default MaterialButtonHamburger;
