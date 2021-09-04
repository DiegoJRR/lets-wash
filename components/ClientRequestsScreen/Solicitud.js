import React from 'react';
import { View } from 'react-native';
import { Text, Card } from '@ui-kitten/components';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment/min/moment-with-locales';
import { currencyFormat } from '../../common';
import { cancelRequestConfirmationModal } from "../handlers/cancel-request";
import Lavador from './LavadorServicio';

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

function Solicitud(props) {
    const navigation = useNavigation();
    const { cost, startTime, employeeData, fulfilled, ref, user } = props.data;

    moment.locale('es-mx');
    const date = moment.unix(startTime?._seconds);

    return (
        <Card
            onPress={() =>
                navigation.navigate('RequestDetail', {
                    request: props.data,
                })
            }
            style={{
                marginHorizontal: 16,
                marginVertical: 8,
                borderRadius: 20,
            }}
            footer={() => (
                <Lavador
                    name={employeeData?.displayName}
                    uri={employeeData?.profilePictureUri}
                    showButtons={!fulfilled}
                    onCancel={cancelRequestConfirmationModal({
                        agent: user,
                        request: ref,
                    })}
                    onChat={() => {
                        navigation.navigate('ChatRoom', {
                            request: {
                                employee: {
                                    ...props.data.employeeData,
                                    ref: props.data.washer,
                                },
                            },
                        });
                    }}
                />
            )}
        >
            <View style={{}}>
                <View style={{}}>
                    <View style={{}}>
                        <Text style={{}}>
                            {capitalize(
                                date.format('dddd D [de] MMMM, YYYY  hh:mm a')
                            )}
                        </Text>
                        <Text style={{}}>{currencyFormat(cost)}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );
}

export default Solicitud;
