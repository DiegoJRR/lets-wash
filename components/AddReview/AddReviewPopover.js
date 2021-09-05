import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
    Card,
    Text,
    Input,
    Button,
    useTheme,
    Spinner,
    Icon,
} from '@ui-kitten/components';
import functions from '@react-native-firebase/functions';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import { addVehicle, setPendingReview } from '../../redux/actions';
import { DataItem, Row } from '../../common';

const StarPicker = (props) => {
    const starPivot = new Array(5).fill(0);
    const [selectedScore, setSelectedScore] = useState(0);

    return (
        <Row
            style={{
                paddingVertical: 10,
                justifyContent: 'center',
            }}
        >
            {starPivot.map((s, idx) => (
                <Icon
                    disabled={props.disabled}
                    onPress={() => {
                        setSelectedScore(idx);
                        props.onChange(idx);
                    }}
                    name="star"
                    style={{ width: 30, height: 30, marginRight: 4 }}
                    fill={idx > selectedScore ? '#C5CEE0' : '#FFC94D'}
                />
            ))}
        </Row>
    );
};

function AddReviewPopUp(props) {
    const { onClose, pendingReview, userRequests } = props;

    const dispatch = useDispatch();
    const theme = useTheme();
    const [comment, setComment] = useState('');
    const [adding, setAdding] = useState(false);
    const [rating, setRating] = useState(0);

    const requestData = useMemo(
        () => userRequests.find((req) => req.ref == pendingReview.request),
        [pendingReview, userRequests]
        );
        const { employeeData } = requestData;
        const date = useMemo(() => moment(requestData.endTime.toMillis()), [
            requestData,
        ]);
        
        if (!employeeData) return <Spinner />;
        
        const dismiss = () => {
            onClose();
            dispatch(setPendingReview(null));
        };

        const submit = (dismissed = false) => {
            setAdding(true);

        // Nota: rating real es rating + 1
        functions()
            .httpsCallable('postReview')({
                rate: dismissed ? 0 : rating + 1, // rating = 0 elimina la review
                comment,
                request: requestData.ref,
                washer: requestData.washer,
            })
            .then(() => {
                dismiss();
            })
            .catch(() => {
                Alert.alert(
                    'No se pudo completar la reseña',
                    'Intentelo más tarde.',
                    [
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ],
                    { cancelable: true }
                );
            })
            .finally(() => {
                setAdding(false);
                dismiss();
            });
    };


    return (
        <Card
            disabled
            style={{
                borderRadius: 20,
                borderColor: theme['color-primary-default-border'],
                borderWidth: 5,
            }}
        >
            <Text
                category="h3"
                style={{ fontWeight: 'bold', textAlign: 'center' }}
            >
                ¿Qué te pareció el servicio de {employeeData.firstName}?
            </Text>
            <View style={{ paddingVertical: 15 }}>
                <Row style={{ paddingVertical: 10 }}>
                    <DataItem
                        label="Fecha"
                        text={date.format('DD / MM / YYYY hh:mm')}
                    />
                    <DataItem
                        label="Empleado"
                        text={`${employeeData.firstName} ${employeeData.lastName}`}
                    />
                </Row>

                <StarPicker
                    disabled={adding}
                    onChange={(value) => setRating(value)}
                />
                <Input
                    disabled={adding}
                    multiline
                    textStyle={{
                        minHeight: 128,
                        textAlignVertical: 'top',
                    }}
                    onChangeText={setComment}
                    style={{ borderRadius: 15 }}
                    placeholder="Escribe un comentario."
                />
            </View>

            <Row>
                <Button
                    disabled={adding}
                    appearance="ghost"
                    status="danger"
                    onPress={() => submit(true)}
                >
                    Omitir
                </Button>
                <Button
                    appearance="ghost"
                    status="basic"
                    onPress={submit}
                    disabled={adding}
                >
                    {adding ? <Spinner /> : 'Enviar'}
                </Button>
            </Row>
        </Card>
    );
}

const mapStateToProps = (state) => {
    const { userRequests, pendingReview } = state;
    return { userRequests, pendingReview };
};

export default connect(mapStateToProps, { addVehicle })(AddReviewPopUp);
