import React, { useState } from 'react';
import {
    Button,
    Layout,
    Text,
    Spinner,
} from '@ui-kitten/components';
import {
    View,
    TouchableWithoutFeedback,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-community/google-signin';
import functions from '@react-native-firebase/functions';
import { signIn } from '../../redux/actions';
import FormGroup from '../FormGroup';
import { signInFields } from './AuthFields';
import { validateEmail } from '../../common';

const SignIn = (props) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [missingFields, setMissingFields] = useState(new Set());

    const addMissingField = (field) => {
        missingFields.add(field);
        setMissingFields(new Set(missingFields));
    };

    const deleteMissingField = (field) => {
        missingFields.delete(field);
        setMissingFields(new Set(missingFields));
    };

    const validateFields = () => {
        let missing = false;

        if (validateEmail(email) == false) {
            missing = true;
            addMissingField('email');
        }
        if (password.length < 8) {
            missing = true;
            addMissingField('password');
        }

        return !missing;
    };

    const signIn = () => {
        if (!validateFields()) return;

        setError(null);
        setLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                setLoading(false);
                props.signIn(res.user);
            })
            .catch((err) => {
                setLoading(false);
                switch (err.code) {
                    case 'auth/user-not-found':
                        setError(
                            'No se encontró un usuario con el correo proporcionado.'
                        );
                        break;
                    case 'auth/wrong-password':
                        setError(
                            'Las credenciales proporcionadas son incorrectas.'
                        );
                        break;
                    default:
                        setError('Se produjo un error.');
                }
            });
    };

    const googleSignIn = async () => {
        setLoading(true);
        try {
            const signin = await GoogleSignin.signIn();
            const { idToken, user: googleUser } = signin;

            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);

            const userCredential = await auth().signInWithCredential(
                googleCredential
            );

            const createUserPayload = {
                firstName: googleUser.givenName,
                lastName: googleUser.familyName,
                email: userCredential.user.email,
                userId: userCredential.user.uid,
            };

            const response = await functions().httpsCallable(
                'createUserWithProvider'
            )(createUserPayload);

            if (response.data.code == 200 || response.data.code == 202) {
                props.signIn(userCredential.user);
            } else {
                console.warn(response.data);
                setLoading(false);
                setError('Se produjo un error. Intenta de nuevo.');
                if (auth().currentUser) {
                    auth().signOut();
                }
            }

            setLoading(false);
        } catch (err) {
            console.warn(err);
            setLoading(false);
            setError('Se produjo un error. Intenta de nuevo.');
            if (auth().currentUser) {
                auth().signOut();
            }
        }
    };

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spinner />
            </View>
        );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Layout
                        style={{
                            flex: 1,
                            padding: 20,
                            justifyContent: 'space-around',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Image
                                source={require('../../assets/LetsWash-Archivos-56.png')}
                                style={{
                                    flex: 1,
                                    minHeight: 300,
                                    width: '100%',
                                    resizeMode: 'center',
                                }}
                            />
                        </View>
                        <Layout
                            style={{
                                // flex: 4,
                                justifyContent: 'center',
                            }}
                        >
                            <FormGroup
                                missingFields={missingFields}
                                fields={signInFields}
                                onChange={(name, value) => {
                                    deleteMissingField(name);
                                    switch (name) {
                                        case 'email':
                                            setEmail(value);
                                            break;
                                        case 'password':
                                            setPassword(value);
                                            break;
                                    }
                                }}
                            />

                            {error ? (
                                <Text status="danger">{error}</Text>
                            ) : null}

                            <Button
                                onPress={signIn}
                                style={{ marginVertical: 5 }}
                            >
                                Inicia Sesión
                            </Button>
                            <GoogleSigninButton
                                onPress={googleSignIn}
                                size={GoogleSigninButton.Size.Wide}
                                style={{
                                    width: '100%',
                                    marginVertical: 5,
                                    marginHorizontal: 0,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                }}
                            />
                            <Text style={{ textAlign: 'center' }}>
                                ¿Aun no tienes una cuenta?{' '}
                                <Text
                                    status="info"
                                    onPress={() =>
                                        props.navigation.navigate('SignUp')
                                    }
                                >
                                    Registrate
                                </Text>
                            </Text>
                        </Layout>
                    </Layout>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => {
    const { isSignedIn } = state;
    return { isSignedIn };
};

export default connect(mapStateToProps, { signIn })(SignIn);
