import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {
    Text,
    Card,
} from '@ui-kitten/components';

function Review({ rating, comment }) {
    const stars = [0, 0, 0, 0, 0];
    stars.fill(1, 0, rating || 2);

    return (
        <Card
            disabled
            style={{
                borderRadius: 20,
                marginBottom: 10,
            }}
        >
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                }}
            >
                <Text style={{ fontWeight: 'bold' }}>Tipo A</Text>
                <View style={styles.rect2}>
                    {stars.map((star, idx) => (
                        <FontAwesomeIcon
                            key={idx}
                            name="star"
                            style={{
                                ...styles.icon,
                                color: star ? '#FFC94D' : 'rgba(155,155,155,1)',
                            }}
                         />
                    ))}
                </View>
            </View>
            <Text
                style={{
                    paddingVertical: 10,
                }}
            >
                {comment}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,1)',
        borderRadius: 20,
    },
    loremIpsum1: {
        fontFamily: 'inter-regular',
        color: '#121212',
        fontSize: 10,
        textAlign: 'left',
        marginTop: 41,
        marginLeft: 15,
        marginRight: 11,
    },
    tipoA: {
        fontFamily: 'inter-500',
        color: '#121212',
        fontSize: 16,
        marginTop: 1,
    },
    tipoAFiller: {
        flex: 1,
        flexDirection: 'row',
    },
    rect2: {
        width: 136,
        height: 21,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        fontSize: 17,
        marginRight: 0,
        margin: 2,
    },
    tipoARow: {
        height: 21,
        flexDirection: 'row',
        marginTop: -53,
        marginLeft: 15,
        marginRight: 20,
    },
});

export default Review;
