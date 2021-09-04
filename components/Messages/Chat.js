import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
    Icon,
    Layout,
    TopNavigation,
    TopNavigationAction,
    StyleService,
    useStyleSheet,
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import {
    Bubble,
    Composer,
    GiftedChat,
    InputToolbar,
    Send,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { setUserData, signOut } from '../../redux/actions';
import 'moment/min/moment-with-locales';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const Chat = (props) => {
    const { userData, user } = props;
    const { employee } = props.route.params.request;
    const [roomId, setRoomId] = useState(null);
    const styles = useStyleSheet(themedStyles);

    const [messages, setMessages] = useState([]);

    const BackAction = () => (
        <TopNavigationAction
            onPress={() => props.navigation.goBack()}
            icon={BackIcon}
        />
    );

    useEffect(() => {
        if (roomId) {
            const messagesListener = firestore()
                .collection('chatRooms')
                .doc(roomId)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .onSnapshot((querySnapshot) => {
                    const messages = querySnapshot.docs.map((doc) => {
                        const firebaseData = doc.data();

                        const data = {
                            _id: doc.id,
                            text: '',
                            createdAt: new Date().getTime(),
                            ...firebaseData,
                        };

                        if (!firebaseData.system) {
                            data.user = {
                                ...firebaseData.user,
                                name: firebaseData.user.email,
                            };
                        }

                        return data;
                    });

                    setMessages(messages);
                });

            return messagesListener;
        }
    }, [roomId]);

    useEffect(() => {
        // TODO: Obtener chat ids en carga de aplicacion, crear en Chat.js si no hay una coleccion
        firestore()
            .collection('chatRooms')
            .where('user', '==', user.uid)
            .where('employee', '==', employee.ref)
            .get()
            .then((res) => {
                if (res.docs.length == 0) {
                    firestore()
                        .collection('chatRooms')
                        .add({
                            user: user.uid,
                            employee: employee.ref,
                        })
                        .then((entry) => {
                            setRoomId(entry.id);
                        });
                } else {
                    setRoomId(res.docs[0].id);
                }
            });
    }, []);

    const onSend = async (messages) => {
        const text = messages[0].text;

        if (roomId) {
            firestore()
                .collection('chatRooms')
                .doc(roomId)
                .collection('messages')
                .add({
                    text,
                    createdAt: new Date().getTime(),
                    user: {
                        _id: user.uid,
                        email: user.email,
                    },
                });

            await firestore()
                .collection('chatRooms')
                .doc(roomId)
                .set(
                    {
                        latestMessage: {
                            text,
                            createdAt: new Date().getTime(),
                        },
                    },
                    { merge: true }
                );
        }
    };

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigation
                title={employee.displayName ?? employee.firstName}
                style={{
                    backgroundColor: 'transparent',
                }}
                navigation={props.navigation}
                accessoryLeft={BackAction}
            />
            <GiftedChat
                messagesContainerStyle={styles.messagesContainerStyle}
                dateFormat="L"
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: styles.wrapperStyleLeft,
                            right: styles.wrapperStyleRight,
                        }}
                        textStyle={{
                            left: styles.textStyleLeft,
                            right: styles.textStyleRight,
                        }}
                    />
                )}
                timeTextStyle={{
                    left: styles.timeTextStyle,
                    right: styles.timeTextStyle,
                }}
                alwaysShowSend
                placeholder="Escribe un mensaje."
                renderInputToolbar={(props) => (
                    <InputToolbar
                        {...props}
                        containerStyle={styles.inputContainer}
                        renderComposer={(props) => (
                            <Composer
                                {...props}
                                textInputStyle={styles.textInput}
                            ></Composer>
                        )}
                        renderSend={(props) => (
                            <Send {...props}>
                                <View style={styles.sendingContainer}>
                                    <Icon
                                        fill={styles.sendButton.color}
                                        style={styles.sendButton}
                                        name="paper-plane"
                                    />
                                </View>
                            </Send>
                        )}
                    ></InputToolbar>
                )}
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user.uid,
                }}
            />
        </Layout>
    );
};

const themedStyles = StyleService.create({
    formInput: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderColor: 'transparent',
        borderBottomColor: 'border-alternative-color-3',
        borderWidth: 0,
    },
    textInput: {
        color: 'text-basic-color',
        backgroundColor: 'background-basic-color-2',
        borderRadius: 20,
        padding: 10,
        marginRight: 8,
    },
    inputContainer: {
        justifyContent: 'center',
        backgroundColor: 'background-basic-color-1',
        borderColor: 'border-basic-color-1',
        marginVertical: 3,
        paddingRight: 3,
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'color-primary-default',
        borderRadius: 30,
    },
    sendButton: {
        color: 'text-control-color',
        width: 28,
        height: 28,
        margin: 5,
        justifyContent: 'center',
    },
    timeTextStyle: {
        color: 'text-disabled-color',
    },
    messagesContainerStyle: {
        backgroundColor: 'background-basic-color-2',
        paddingBottom: 5,
    },
    wrapperStyleLeft: {
        backgroundColor: 'color-primary-disabled',
    },
    wrapperStyleRight: {
        backgroundColor: 'color-primary-default',
    },
    textStyleLeft: {
        color: 'text-basic-color',
    },
    textStyleRight: {
        color: 'text-control-color',
    },
    container: {
        flex: 1,
    },
    textBox: {
        alignSelf: 'stretch',
    },
});

const mapStateToProps = (state) => {
    const { user, userData } = state;
    return { user, userData };
};

export default connect(mapStateToProps, { signOut, setUserData })(Chat);
