import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Pressable,
} from 'react-native';
import {
    Button,
    Icon,
    Layout,
    Input,
    Divider,
    TopNavigation,
    TopNavigationAction,
    Spinner,
    Avatar,
    useTheme,
    StyleService,
    useStyleSheet,
} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import { connect } from 'react-redux';
import { setUserData, signOut } from '../redux/actions';
import { Label, Row } from '../common';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AvatarSelector = (props) => {
    const theme = useTheme();

    return (
        <View
            style={{
                borderColor: theme['background-alternative-color-1'],
                borderWidth: 5,
                borderRadius: 100,
                padding: 5,
                ...props.style,
            }}
        >
            <Avatar
                style={{
                    width: 100,
                    height: 100,
                }}
                shape="round"
                source={
                    props.imageUri
                        ? { uri: props.imageUri }
                        : props.placeholderUri
                }
            />
            {props.editing ? (
                <Pressable
                    onPress={props.onPress}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        backgroundColor:
                            theme['background-alternative-color-1'],
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Icon
                        name="edit"
                        style={{
                            width: 24,
                            height: 24,
                        }}
                        fill={theme['background-basic-color-1']}
                    />
                </Pressable>
            ) : null}
        </View>
    );
};

function Profile(props) {
    const { userData, user } = props;
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [buttonName, setButton] = useState('Editar');
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [email, setEmail] = useState(userData.email);
    const [image, setImage] = useState(null);
    const theme = useTheme();

    const styles = useStyleSheet(themedStyles);

    const BackAction = () => (
        <TopNavigationAction
            onPress={() => props.navigation.goBack()}
            icon={BackIcon}
        />
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const reset = () => {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setImage(null);
        setEditing(false);
    };

    const submit = async () => {
        setEditing(false);
        setUploading(true);

        let imageRef = null;
        if (image) {
            const filename = image.substring(image.lastIndexOf('/') + 1);
            const uploadUri =
                Platform.OS === 'ios' ? image.replace('file://', '') : image;
            const referenceSnapshot = storage().ref(
                'profilePictures/' + filename
            ); // TODO: Error handling y tratar de mover a backend
            imageRef = await referenceSnapshot.putFile(uploadUri);

            // TODO: borrar foto de perfil anterior
        }

        const payload = {
            firstName,
            lastName,
            email,
            profilePicture: imageRef
                ? `gs://${imageRef.metadata.bucket}/${imageRef.metadata.fullPath}`
                : userData.profilePictureRef,
        };

        functions()
            .httpsCallable('updateUser')(payload)
            .then((res) => {
                setUploading(false);
                setButton('Editar');
                setUserData({
                    ...userData,
                    ...payload,
                    displayName:
                        firstName.trim().split(' ')[0] +
                        ' ' +
                        lastName.trim().split(' ')[0],
                    profilePictureRef: payload.profilePicture,
                    profilePicture: image,
                });
            })
            .catch((err) => {
                console.warn(err);
            });
    };

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigation
                title="Perfil"
                style={{
                    backgroundColor: 'transparent',
                }}
                accessoryLeft={BackAction}
            />
            <Divider />
            <ScrollView style={{ flex: 1 }}>
                <View
                    style={{
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <AvatarSelector
                        editing={editing}
                        imageUri={image}
                        placeholderUri={
                            userData.profilePicture
                                ? { uri: userData.profilePicture }
                                : require('../assets/placeholder.jpg')
                        }
                        onPress={pickImage}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        padding: 20,
                    }}
                >
                    <Input
                        disabled={!editing}
                        style={styles.formInput}
                        label={() => <Label>Nombre</Label>}
                        value={firstName}
                        onChangeText={(v) => setFirstName(v)}
                    />
                    <Input
                        disabled={!editing}
                        style={styles.formInput}
                        label={() => <Label>Apellido</Label>}
                        value={lastName}
                        onChangeText={(v) => setLastName(v)}
                    />
                    <Input
                        disabled={true} // Change to !editing to allow changes
                        style={styles.formInput}
                        label={() => <Label>Correo</Label>}
                        onChangeText={(v) => setEmail(v)}
                        value={email}
                    />
                </View>
            </ScrollView>
            <View
                style={{
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    onPress={() => {
                        auth()
                            .signOut()
                            .then((res) => props.signOut());
                    }}
                    appearance="ghost"
                    status="danger"
                >
                    Cerrar Sesión
                </Button>
                <Row>
                    {editing ? (
                        <Button
                            appearance="ghost"
                            status="basic"
                            onPress={reset}
                        >
                            Cancelar
                        </Button>
                    ) : null}
                    <Button
                        appearance="ghost"
                        onPress={() => {
                            if (editing) {
                                submit();
                            } else {
                                setEditing(true);
                                setButton('Guardar');
                            }
                        }}
                    >
                        {editing ? (
                            'Guardar'
                        ) : uploading ? (
                            <Spinner />
                        ) : (
                            'Editar'
                        )}
                    </Button>
                </Row>
            </View>
        </Layout>
    );
}

const themedStyles = StyleService.create({
    formInput: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderColor: 'transparent',
        borderBottomColor: 'border-alternative-color-3',
        borderWidth: 0,
        marginVertical: 5,
    },
    container: {
        flex: 1,
    },
    textBox: {
        height: 40,
        alignSelf: 'stretch',
    },
});

const mapStateToProps = (state) => {
    const { user, userData } = state;
    return { user, userData };
};

export default connect(mapStateToProps, { signOut, setUserData })(Profile);
