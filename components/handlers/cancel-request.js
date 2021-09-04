import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const cancelRequest = async (payload) => {
    await firestore()
        .collection('rejection')
        .add({
            ...payload,
            rejectBy: 'user',
            solved: false,
        });

    firestore().collection('requests').doc(payload.request).update({
        washer: null,
        user: null,
        cancelled: true,
    });
};

export const confirmationModal = (title, message, callback) => {
    return () =>
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Si',
                    onPress: callback,
                    style: 'destructive',
                },
                {
                    text: 'No',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
};

export const cancelRequestConfirmationModal = (payload) =>
    confirmationModal(
        'Cancelar solicitud',
        '¿Seguro que deseas cancelar la solicitud?',
        () => cancelRequest(payload)
    );
