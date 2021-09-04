import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import {
    cleanServices,
    setVehicles,
    removeService,
    addService,
} from '../../redux/actions';

class VehicleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loadingCarList: this.props.vehicles.length == 0,
            loadingCarList: false, // TODO: guardar en estado si ya se terminaron de obtener los vehiculos
        };
    }

    render() {
        const { loadingCarList } = this.state;
        const {
            animation,
            services,
            vehicles,
            removeService,
            addService,
            onSelect,
        } = this.props;

        if (!this.props.render) return null;
        return (
            <Animated.View
                style={{
                    width: '100%',
                    height: 'auto',
                    top: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                    }),
                    marginVertical: 5,
                }}
            >
                <View
                    style={{
                        margin: 5,
                        flexDirection: 'row',
                    }}
                >
                    {/* <ScrollView
                        style={styles.scrollView}
                        horizontal={true}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {loadingCarList ? (
                            <View style={styles.spinnerContainer}>
                                <Spinner />
                            </View>
                        ) : (
                            vehicles.map((vehicle, idx) => {
                                if (!vehicle) return null;

                                return (
                                    <CarOption
                                        selected={false} // selected
                                        onMenuPress={() => onSelect(vehicle)}
                                        onPress={() => {}}
                                        alias={vehicle.alias}
                                        color={vehicle.color}
                                        key={idx}
                                    ></CarOption>
                                );
                            })
                        )}
                    </ScrollView>
                    <MaterialButtonHamburger
                        onPress={this.props.onAddPress}
                        captionName="menu"
                        caption="plus"
                        style={styles.materialButtonHamburger}
                    ></MaterialButtonHamburger> */}
                </View>
                <View
                    style={{
                        width: '100%',
                    }}
                >
                    <Button
                        style={styles.requestButton}
                        onPress={this.props.onRequestPress}
                    >
                        Solicitar
                    </Button>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    materialButtonHamburger: {
        height: 'auto',
        width: 67,
        borderRadius: 10,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        elevation: 30,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    spinnerContainer: {
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    scrollView: {
        flexGrow: 1,
        height: 'auto',
        marginRight: 0,
    },
    scrollContent: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    requestButton: {
        marginHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 5,
    },
});

const mapStateToProps = (state) => {
    const { selectedAddress, vehicles, services } = state;
    return { selectedAddress, vehicles, services };
};

export default connect(mapStateToProps, {
    cleanServices,
    setVehicles,
    removeService,
    addService,
})(VehicleSelector);
