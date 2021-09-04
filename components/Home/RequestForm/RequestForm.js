import React from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import OverCard from '../OverCard';
import ServiceSelection from './serviceSelection';
import ScheduleSelection from './scheduleSelection';
import Confirmation from './confirmation';
import Resumen from './ResumenComponent';
import { connect } from 'react-redux';
import { cleanServices, setVehicles } from '../../../redux/actions';
import PaymentMethodSelection from './PaymentMethodSelection';
import { requestFormContext } from './RequestFormContext';
import { useFocusEffect } from '@react-navigation/native';

class RequestForm extends React.Component {
    constructor(props) {
        super(props);
        const { selectedAddress } = this.props;
        this.overCarRef = React.createRef();
        this.backButtonHandler = null;
        this.state = {
            formStep: 0,
            disableNext: true,
            context: {
                step: 0,
                allowStep: false,
                footerOptions: {
                    display: true,
                    disabled: false,
                    left: {
                        display: true,
                        text: 'Cancelar',
                    },
                    right: {
                        display: true,
                        text: 'Continuar',
                    },
                },
                setAllowStep: (allow) => {
                    this.setState((prevState) => ({
                        context: {
                            ...prevState.context,
                            allowStep: allow,
                        },
                    }));
                },
                setFooterOptions: (options) => {
                    this.setState((prevState) => ({
                        context: {
                            ...prevState.context,
                            footerOptions: {
                                ...prevState.context.footerOptions,
                                ...options,
                            },
                        },
                    }));
                },
                setFooterLabels: (left, right) => {
                    this.setState({
                        footerOptions: {
                            left: {
                                text: left,
                            },
                            right: {
                                text: right,
                            },
                        },
                    });
                },
                prev: () => {
                    if (this.overCarRef?.current) {
                        this.overCarRef.current.prev();
                    }
                },
                next: () => {
                    if (this.overCarRef?.current) {
                        this.overCarRef.current.next();
                    }
                },
            },
        };
    }

    backAction = () => {
        if (this.state.formStep == 0) {
            this.backButtonHandler.remove();
            this.close();
        } else {
            this.overCarRef.current.prev();
        }

        return true;
    };

    close = () => {
        this.overCarRef.current.close();
        this.backButtonHandler.remove();
    };

    componentDidMount() {
        this.backButtonHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backButtonHandler.remove();
    }

    render() {
        const { formStep } = this.state;
        const { selectedAddress, requestData, services, userData } = this.props;

        if (!this.props.render) return null;
        return (
            <requestFormContext.Provider value={this.state.context}>
                <HandleBackButton backButtonHandler={this.backAction} />
                <OverCard
                    ref={this.overCarRef}
                    onChangeStep={(step) => {
                        this.setState((prevState) => ({
                            context: {
                                ...prevState.context,
                                allowStep: false,
                            },
                        }));
                        this.setState({ formStep: step });
                    }}
                    onCancel={this.props.onCancel}
                    allowStep={this.state.context.allowStep}
                    footerOptions={this.state.context.footerOptions}
                >
                    <ServiceSelection
                        render={formStep >= 0}
                        active={formStep == 0}
                    />
                    <ScheduleSelection
                        render={formStep >= 1}
                        active={formStep == 1}
                    />
                    <Confirmation
                        render={formStep >= 2}
                        active={formStep == 2}
                    />
                    <PaymentMethodSelection
                        render={formStep >= 3}
                        active={formStep == 3}
                    />
                    <Resumen
                        render={formStep >= 4}
                        active={formStep == 4}
                        onClose={() => {
                            this.props.cleanServices();
                            this.close();
                        }}
                    />
                </OverCard>
            </requestFormContext.Provider>
        );
    }
}

const HandleBackButton = ({ backButtonHandler }) => {
    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener(
                'hardwareBackPress',
                backButtonHandler
            );

            return () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    backButtonHandler
                );
        })
    );

    return null;
};

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 300,
        bottom: 0,
        elevation: 0,
    },
    map: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        elevation: -1,
    },
    carOption: {
        width: 121,
        height: 89,
        margin: 5,
    },
    materialButtonHamburger: {
        height: 102,
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
});

const mapStateToProps = (state) => {
    const {
        selectedAddress,
        vehicles,
        services,
        requestData,
        userData,
    } = state;
    return {
        selectedAddress,
        vehicles,
        services: services.filter((s) => s.active),
        requestData,
        userData,
    };
};

export default connect(
    mapStateToProps,
    {
        cleanServices,
        setVehicles,
    },
    null,
    {
        forwardRef: true,
    }
)(RequestForm);
