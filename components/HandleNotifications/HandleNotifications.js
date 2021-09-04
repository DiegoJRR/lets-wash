import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HandleNotifications = (props) => {
    saveTokenToDataBase = async (token) => {
        const userId = auth().currentUser.uid;

        await firestore()
            .collection('users')
            .doc(userId)
            .update({
                tokens: firestore.FieldValue.arrayUnion(token),
            });
    };

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
        } catch (error) {
            console.warn('Permiso denegado / notificaciones');
        }
    };

    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();

        if (!enabled) {
            this.requestPermission();
        }
    };

    getToken = async () => {
        await this.checkPermission();

        await messaging()
            .getToken()
            .then((token) => {
                this.saveTokenToDataBase(token);
                return token;
            });

        messaging().onTokenRefresh((token) => this.saveTokenToDataBase(token));
    };

    useEffect(() => {
        getToken();
        messaging()
            .getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    console.log(notificationOpen);
                    // const { title, body } = notificationOpen.notification;
                    // Handle notification data
                }
            });

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            // Alert.alert(
            //     'A new FCM message arrived!',
            //     JSON.stringify(remoteMessage)
            // );
        });

        return () => {
            unsubscribe();
        };
    });

    return null;
};

export default HandleNotifications;
