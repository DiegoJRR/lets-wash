import React, { useState } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    Keyboard,
} from 'react-native';
import {
    Button,
    Layout,
    Text,
    Spinner,
} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import { connect } from 'react-redux';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-community/google-signin';
import { signIn } from '../../redux/actions';
import FormGroup from '../FormGroup';
import { signUpFields } from './AuthFields';
import { validateEmail } from '../../common';

const SignUp = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [missingFields, setMissingFields] = useState(new Set());

    const addMissingField = (field) => {
        setMissingFields(new Set([...missingFields, field]));
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
        if (firstName.length == 0) {
            missing = true;
            addMissingField('firstName');
        }
        if (lastName.length == 0) {
            missing = true;
            addMissingField('lastName');
        }
        if (password != confirmPassword) {
            missing = true;
            addMissingField('confirmPassword');
        }

        return !missing;
    };

    const signUp = () => {
        if (!validateFields()) return;

        setLoading(true);
        functions()
            .httpsCallable('createUser')({
                firstName,
                lastName,
                email,
                password,
            })
            .then((response) => {
                setLoading(false);
                auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((res) => {
                        setLoading(false);
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
            })
            .catch((err) => {
                setLoading(false);
                setError('Se produjo un error. Intenta de nuevo.');

                // TODO: Error Handling
            });
    };

    const googleSignUp = async () => {
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
                                justifyContent: 'center',
                            }}
                        >
                            <FormGroup
                                missingFields={missingFields}
                                fields={signUpFields}
                                onChange={(name, value) => {
                                    deleteMissingField(name);
                                    switch (name) {
                                        case 'firstName':
                                            setFirstName(value);
                                            break;
                                        case 'lastName':
                                            setLastName(value);
                                            break;
                                        case 'email':
                                            setEmail(value);
                                            break;
                                        case 'password':
                                            setPassword(value);
                                            break;
                                        case 'confirmPassword':
                                            setConfirmPassword(value);
                                            break;
                                    }
                                }}
                            />
                            {error ? (
                                <Text status="danger">{error}</Text>
                            ) : null}

                            <Button
                                onPress={signUp}
                                style={{ marginVertical: 5 }}
                            >
                                Registrate
                            </Button>
                            <GoogleSigninButton
                                onPress={googleSignUp}
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
                                ¿Ya tienes una cuenta?{' '}
                                <Text
                                    status="info"
                                    onPress={() =>
                                        props.navigation.navigate('SignIn')
                                    }
                                >
                                    Inicia Sesión
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

export default connect(mapStateToProps, { signIn })(SignUp);
