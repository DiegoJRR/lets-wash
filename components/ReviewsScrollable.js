import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Review from './Review';

function ReviewsScrollable({ data }) {
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
                    {data.map((review, idx) => (
                        <Review key={idx} style={styles.review} {...review} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    scrollArea: {
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 5,
        shadowOpacity: 0.01,
        shadowRadius: 0,
        flex: 1,
        alignSelf: 'stretch',
        marginTop: 20,
        marginRight: 0,
        marginLeft: 0,
    },
    scrollArea_contentContainerStyle: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        flexWrap: 'nowrap',
    },
    review: {
        height: 97,
        margin: 5,
        paddingTop: 8,
        alignSelf: 'stretch',
        marginRight: 14,
        marginLeft: 14,
        marginBottom: 7,
    },
});

export default ReviewsScrollable;
