import React, { Component } from 'react';
import { View, ScrollView, Animated, Easing } from 'react-native';
import { Dimensions } from 'react-native';
import { Text, Divider, withStyles, useTheme } from '@ui-kitten/components';
const window = Dimensions.get('window');

const Footer = (props) => {
    const theme = useTheme();

    // TODO: Refactor para tomar solo props left y right
    return (
        <View
            {...props}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 12,
                marginHorizontal: 15,
            }}
        >
            <Text
                category="p1"
                style={{
                    fontWeight: 'bold',
                    color:
                        props.disabledLeft || props.disabled
                            ? theme['text-disabled-color']
                            : theme['text-basic-color'],
                }}
                onPress={() => {
                    if (!props.disabled) {
                        if (props.options?.left.action) {
                            props.options.left.action();
                        } else {
                            props.close();
                        }
                    }
                }}
            >
                {props.options.left.text}
            </Text>
            <Text
                category="p1"
                style={{
                    fontWeight: 'bold',
                    color:
                        props.disabledRight || props.disabled
                            ? theme['text-disabled-color']
                            : theme['text-basic-color'],
                }}
                onPress={() => {
                    if (!props.disabled && !props.disabledRight) {
                        if (props.options?.right?.action) {
                            props.options.right.action();
                        } else {
                            props.next();
                        }
                    }
                }}
            >
                {props.options.right.text}
            </Text>
        </View>
    );
};
class OverCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            translateAnim: new Animated.Value(100),
        };
    }

    componentDidMount() {
        Animated.timing(this.state.translateAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }

    close = () => {
        this.setState({ selectedIndex: 0 });
        Animated.timing(this.state.translateAnim, {
            toValue: 100,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start(() => {
            this.props.onCancel();
            this.props.onChangeStep(0);
        });
    };

    prev = () => {
        if (!this.props.allowStep) return; // TODO: agregar allowStep en otra direccion
    };

    next = () => {
        if (!this.props.allowStep) return;
        this.props.onChangeStep(this.state.selectedIndex + 1);
        if (this.swiper) {
            this.swiper.scrollTo({
                x: window.width * (this.state.selectedIndex + 1),
                y: 0,
                animated: true,
            });
        }
        this.setState((prevState) => ({
            selectedIndex: prevState.selectedIndex + 1,
        }));
    };

    render() {
        const { eva } = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
                <Animated.View
                    style={[
                        {
                            top: this.state.translateAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                        eva.style.card,
                    ]}
                >
                    <View
                        style={{
                            flex: 1,
                            position: 'relative',
                        }}
                    >
                        <ScrollView
                            ref={(c) => (this.swiper = c)}
                            horizontal={true}
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                width:
                                    window.width * this.props.children.length, // TODO: Factor depende manualmente del # de pantallas
                            }}
                            scrollEventThrottle={32}
                            bounces={false}
                            directionalLockEnabled={true}
                        >
                            {this.props.children}
                        </ScrollView>
                    </View>
                    <Divider></Divider>
                    {this.props.footerOptions.display ? (
                        <Footer
                            disabled={this.props.footerOptions.disabled}
                            close={this.close}
                            next={this.next}
                            selectedIndex={this.state.selectedIndex}
                            disabledRight={!this.props.allowStep}
                            options={this.props.footerOptions}
                        />
                    ) : null}
                </Animated.View>
            </View>
        );
    }
}

const StyledOverCard = withStyles(OverCard, (theme) => ({
    card: {
        elevation: 50,
        zIndex: 50,
        flex: 1,
        borderTopEndRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: theme['background-basic-color-1'],
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
}));

export default StyledOverCard;
