import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Icon,
    Layout,
    TopNavigation,
    TopNavigationAction,
    TabView,
    Tab,
    useTheme,
    Avatar,
} from '@ui-kitten/components';

import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ReviewsScrollable from './ReviewsScrollable';
import ServicesScrollable from './ServicesScrollable';
import { Label } from '../common';
import Stars from './Estrellas';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function EmployeeReviews(props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const theme = useTheme();

    const { navigation } = props;
    const BackAction = () => (
        <TopNavigationAction
            onPress={() => navigation.goBack()}
            icon={BackIcon}
        />
    );

    const {
        services: employeeServices,
        displayName,
        rating,
        ref,
        profilePictureUri,
    } = props.route.params;

    const { serviceTypes } = props;

    const getReviews = async () => {
        const reviewSnapshot = await firestore() //TODO: persistir
            .collection('washers')
            .doc(ref)
            .collection('reviews')
            .get();

        return reviewSnapshot.docs.map((doc) => doc.data());
    };
    useEffect(() => {
        getReviews()
            .then((result) => {
                setReviews(result);
            })
            .catch((err) => console.warn(err));
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.group4}>
                <Layout level="2">
                    <TopNavigation
                        style={{
                            backgroundColor: 'transparent',
                        }}
                        accessoryLeft={BackAction}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 16,
                            paddingBottom: 16,
                        }}
                    >
                        <Avatar
                            style={{
                                width: 60,
                                height: 60,
                            }}
                            source={
                                profilePictureUri &&
                                profilePictureUri.length > 0
                                    ? { uri: profilePictureUri }
                                    : require('../assets/placeholder.jpg')
                            }
                        />
                        <View>
                            <Label>{displayName || ''}</Label>
                            <Stars rate={rating} />
                        </View>
                    </View>
                </Layout>
                <TabView
                    style={{
                        flex: 1,
                        backgroundColor: theme['background-basic-color-2'],
                    }}
                    selectedIndex={selectedIndex}
                    tabBarStyle={{
                        backgroundColor: theme['background-basic-color-2'],
                        paddingVertical: 15,
                    }}
                    onSelect={(index) => setSelectedIndex(index)}
                >
                    <Tab title="SERVICIOS">
                        <Layout
                            level="3"
                            style={{
                                flex: 1,
                            }}
                        >
                            <ServicesScrollable
                                data={employeeServices.map((service) => {
                                    const serviceMatch = serviceTypes.find(
                                        (s) => s.ref == service
                                    );

                                    return {
                                        title: serviceMatch?.name,
                                        text: serviceMatch?.description,
                                    };
                                })}
                            />
                        </Layout>
                    </Tab>
                    <Tab title="RESEÑAS">
                        <Layout
                            level="3"
                            style={{
                                flex: 1,
                            }}
                        >
                            <ReviewsScrollable data={reviews} />
                        </Layout>
                    </Tab>
                </TabView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F9FC',
        flex: 1,
    },
    group4Filler: {
        flex: 1,
    },
    group4: {
        height: 782,
    },
    icon2: {
        color: 'rgba(128,128,128,1)',
        fontSize: 40,
        marginLeft: 11,
    },
    group1: {
        height: 82,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 15,
    },
    profileImage1: {
        height: 80,
        alignSelf: 'center',
        marginLeft: 41,
        flex: 0.27,
        marginRight: 20,
    },
    group2: {
        height: 54,
        alignSelf: 'center',
        marginLeft: 0,
        width: 117,
    },
    group3: {
        height: 28,
        flexDirection: 'row',
    },
    icon1: {
        color: 'rgba(248,231,28,1)',
        fontSize: 18,
        marginLeft: 58,
        marginTop: 1,
    },
    xXx1: {
        fontFamily: 'inter-500',
        color: '#121212',
        fontSize: 16,
        marginLeft: -75,
    },
    icon1Row: {
        height: 20,
        flexDirection: 'row',
        flex: 1,
        marginRight: 42,
        marginTop: 4,
    },
    materialIconTextButtonsFooter1: {
        height: 54,
        alignSelf: 'stretch',
    },
    rect: {
        height: 2,
        backgroundColor: '#F7F9FC',
        width: 187,
        alignSelf: 'flex-end',
    },
    reviewsScrollable: {
        height: 544,
        alignSelf: 'stretch',
    },
});

export default connect((state) => ({ serviceTypes: state.serviceTypes }))(
    EmployeeReviews
);
