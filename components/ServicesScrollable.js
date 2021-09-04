import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import DriverService from './DriverService';

function ServicesScrollable({ data }) {
    const [height, setHeight] = useState(0);
    return (
        <View
            style={{
                flex: 1,
                width: '100%',
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    width: '100%',
                    padding: 20,
                }}
                horizontal={false}
                contentContainerStyle={{
                    height: height + 100,
                }}
            >
                <View
                    onLayout={(event) => {
                        setHeight(event.nativeEvent.layout.height);
                    }}
                >
                    {data.map((service, idx) => (
                        <DriverService
                            key={idx}
                            style={styles.driverService}
                            {...service}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    scrollArea1: {
        flex: 1,
        alignSelf: 'stretch',
        margin: 0,
    },
    scrollArea1_contentContainerStyle: {
        height: 'auto',
        alignItems: 'stretch',
    },
    driverService: {
        height: 117,
        alignSelf: 'stretch',
        margin: 20,
        marginBottom: 0,
        marginRight: 16,
        marginLeft: 26,
    },
    driverService1: {
        height: 117,
        alignSelf: 'stretch',
        margin: 20,
        marginBottom: 0,
        marginRight: 16,
        marginLeft: 26,
    },
    driverService2: {
        height: 117,
        alignSelf: 'stretch',
        margin: 20,
        marginBottom: 0,
        marginRight: 16,
        marginLeft: 26,
    },
    driverService3: {
        height: 117,
        alignSelf: 'stretch',
        margin: 20,
        marginBottom: 0,
        marginRight: 16,
        marginLeft: 26,
    },
    driverService4: {
        height: 117,
        alignSelf: 'stretch',
        margin: 20,
        marginBottom: 0,
        marginRight: 16,
        marginLeft: 26,
    },
});

export default ServicesScrollable;
