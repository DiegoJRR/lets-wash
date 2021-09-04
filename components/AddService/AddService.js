import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import {
    View,
    Dimensions,
    ScrollView,
} from 'react-native';
import {
    Layout,
    Text,
    useTheme,
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import ChooseService from './ChooseService';
import { addService, removeService } from '../../redux/actions';

const window = Dimensions.get('window');

const Footer = (props) => {
    const theme = useTheme();
    return (
        <Layout
            {...props}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 15,
            }}
        >
            <Text
                category="p1"
                style={{ fontWeight: 'bold' }}
                onPress={props.onCancel}
            >
                Cancelar
            </Text>
            <Text
                disabled={props.isNextDisabled()}
                category="p1"
                style={{ fontWeight: 'bold' }}
                onPress={props.onNext}
            >
                Continuar
            </Text>
        </Layout>
    );
};

const AddService = (props) => {
    const { serviceTypes } = props;
    const swiper = useRef();
    const index = props.route?.params?.index;
    const service = props.route?.params?.service;
    const [selectedIndex, setSelectedIndex] = useState(index || 0);
    const [selectedVehicle, setSelectedVehicle] = useState(service?.vehicle);
    const [selectedService, setSelectedService] = useState(service?.service);

    // useEffect(() => {
    //     swiper.current.scrollTo({
    //         x: window.width * selectedIndex,
    //         y: 0,
    //         animated: true,
    //     });
    // }, [selectedIndex]);

    useEffect(() => {
        // if (service) {
        //     props.removeService(service.index);
        // }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                // ref={swiper}
                // horizontal={true}
                // pagingEnabled
                // showsHorizontalScrollIndicator={false}
                // showsVerticalScrollIndicator={false}
                // scrollEnabled={false}
                // contentContainerStyle={{
                //     width: window.width * 2,
                // }}
                // scrollEventThrottle={32}
                // bounces={false}
                // directionalLockEnabled={true}
            >
                {/* <Layout style={{ flex: 1 }} level="2">
                    <ChooseCar
                        selected={selectedVehicle?.ref}
                        onChoose={(vehicle) => setSelectedVehicle(vehicle)}
                    />
                </Layout> */}
                <Layout style={{ flex: 1 }} level="2">
                    <ChooseService
                        selected={selectedService?.ref}
                        vehicleType={
                            selectedVehicle ? selectedVehicle.type : null
                        }
                        onChoose={(service) => {
                            setSelectedService(service);
                            props.addService({
                                vehicle: selectedVehicle,
                                service: service,
                            });
                            props.navigation.goBack();
                        }}
                    />
                </Layout>
            </ScrollView>
            <Footer
                onCancel={() => {
                    // if (service) {
                    //     props.addService({
                    //         vehicle: selectedVehicle,
                    //         service: selectedService,
                    //     });
                    // }
                    props.navigation.goBack();
                }}
                isNextDisabled={() => {
                    return (
                        (selectedIndex === 0 && !selectedVehicle) ||
                        (selectedIndex === 1 && !selectedService)
                    );
                }}
                onNext={() => {
                    props.addService({
                        vehicle: selectedVehicle,
                        service: selectedService,
                    });
                    props.navigation.goBack();
                    // if (selectedIndex === 1) {
                    // props.addService({
                    //     vehicle: selectedVehicle,
                    //     service: selectedService,
                    // });
                    // props.navigation.goBack();
                    // }
                    // setSelectedIndex(selectedIndex + 1);
                }}
            />
        </View>
    );
};

const mapStateToProps = (state) => {
    const { vehicles, services, serviceTypes } = state;
    return { vehicles, services, serviceTypes };
};

export default connect(mapStateToProps, { addService, removeService })(
    AddService
);
