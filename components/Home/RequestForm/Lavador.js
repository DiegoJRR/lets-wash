import React, {  } from 'react';
import { View } from 'react-native';
import {
    Card,
    Text,
    useTheme,
    Avatar,
    Icon,
    useStyleSheet,
    StyleService,
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import placeholder from '../../../assets/placeholder.jpg';
import Estrellas from '../../Estrellas';
import { Row } from '../../../common';

const selectedStyle = {
    // shadowColor: '#FF0000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
};

function Lavador(props) {
    const navigation = useNavigation();
    const styles = useStyleSheet(themedStyles);
    const theme = useTheme();

    return (
        <Card
            onPress={props.onPress}
            style={(() => {
                let curr = {
                    borderRadius: 20,
                    marginBottom: 10,
                };
                if (props.selected) {
                    curr = { ...curr, ...selectedStyle };
                }
                return curr;
            })()}
        >
            <Row>
                <View
                    style={{
                        paddingRight: 15,
                        justifyContent: 'center',
                    }}
                >
                    <Avatar
                        style={{ width: 50, height: 50 }}
                        source={
                            props.data.profilePictureUri
                                ? { uri: props.data.profilePictureUri }
                                : placeholder
                        }
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.lavador1}>
                        {props.data.displayName}
                    </Text>
                    <Estrellas
                        rate={props.data.rating}
                        style={styles.estrellas}
                    ></Estrellas>
                </View>
                <Icon
                    onPress={() => navigation.navigate('Employee', props.data)} // TODO: props.data.ref
                    name="info-outline"
                    style={{ width: 30, height: 30 }}
                    fill={theme['text-hint-color']}
                />
            </Row>
        </Card>
    );
}

const themedStyles = StyleService.create({
    lavador1: {
        color: 'text-basic-color',
        fontSize: 16,
    },
    estrellas: {
        width: 163,
        height: 36,
        marginTop: 10,
        marginLeft: -5,
    },
});

export default Lavador;
