import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import {
    Text,
    useTheme,
    Select,
    SelectItem,
    Spinner,
    StyleService,
    useStyleSheet,
    Card,
} from '@ui-kitten/components';
import functions from '@react-native-firebase/functions';
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {
    populateEmployee,
    addEmployees,
    setRequestData,
} from '../../../redux/actions';
import { Label } from '../../../common';
import { defaultFooterOptions, requestFormContext } from './RequestFormContext';
import Lavador from './Lavador';

const availableHours = [
    { time: moment.duration(9, 'hours'), label: '09:00' },
    { time: moment.duration(10, 'hours'), label: '10:00' },
    { time: moment.duration(11, 'hours'), label: '11:00' },
    { time: moment.duration(12, 'hours'), label: '12:00' },
    { time: moment.duration(13, 'hours'), label: '13:00' },
    { time: moment.duration(14, 'hours'), label: '14:00' },
    { time: moment.duration(15, 'hours'), label: '15:00' },
    { time: moment.duration(16, 'hours'), label: '16:00' },
    { time: moment.duration(17, 'hours'), label: '17:00' },
    { time: moment.duration(18, 'hours'), label: '18:00' },
];

const { max } = Math;

const Header = (props) => (
    <View {...props}>
        <Text category="h6" style={{ fontWeight: 'bold' }}>
            Fecha del lavado
        </Text>
    </View>
);

function ScheduleSelection(props) {
    const rfContext = useContext(requestFormContext);
    const theme = useTheme();
    const styles = useStyleSheet(themedStyles);
    const { services, requestData, setRequestData, active } = props;

    let duration = 0;
    for (let index = 0; index < services.length; index++) {
        const serviceObj = services[index];

        if (serviceObj.active) {
            const service = serviceObj.service;
            duration += service.durationMin;
        }
    }

    const today =
        moment(today).hours() > 18
            ? moment(today).add(1, 'day').set('h', 8).toDate()
            : moment(today)
                  .add(1, 'hour')
                  .set('h', max(8, moment(today).hours()))
                  .toDate();

    const weekLapse = moment(new Date()).add(1, 'week').set('h', 18).toDate();
    const [date, setDate] = React.useState(today);

    const [selectedTime, setSelectedTime] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [height, setHeight] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedWasher, setSelectedWasher] = useState(null);
    const [loadingEmployeeList, setLoadingEmployeeList] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);

    if (props.hidden) return null;

    const checkAllowStep = () => {
        if (!active) return;
        if (
            requestData?.employee?.ref &&
            requestData?.date &&
            !rfContext.allowStep
        ) {
            rfContext.setAllowStep(true);
        } else if (
            (!requestData?.employee?.ref || !requestData?.date) &&
            rfContext.allowStep
        ) {
            rfContext.setAllowStep(false);
        }

        if (activeSection == 0 && selectedIndex) {
            rfContext.setAllowStep(true);
        } else if (activeSection == 0 && selectedIndex == null) {
            rfContext.setAllowStep(false);
        }
    };

    useEffect(() => {
        checkAllowStep();
        if (active) {
            rfContext.setFooterOptions({
                ...defaultFooterOptions,
                right: {
                    display: true,
                    text: 'Continuar',
                    action: () => {
                        if (activeSection == 0) {
                            setActiveSection(1);
                        } else if (activeSection == 1) {
                            rfContext.next();
                        }
                    },
                },
            });
        }
    }, [active, activeSection]);

    useEffect(() => {
        if (activeSection == 1) {
            loadEmployees();
        }
    }, [activeSection]);

    useEffect(() => {
        checkAllowStep();
        setRequestData({
            date: null,
            employee: null,
        });
    }, []);

    useEffect(() => {
        checkAllowStep();
    }, [requestData, selectedIndex]);

    const fillProfilePicutreUris = async (employeeList) => {
        const list = [];
        for (let employee of employeeList) {
            const uri = await storage()
                .refFromURL(
                    employee.profilePicture ||
                        'gs://carwash-40bc9.appspot.com/placeholder.jpg'
                )
                .getDownloadURL();

            list.push({
                ...employee,
                profilePictureUri: uri,
            });
        }

        return list;
    };

    const loadEmployees = async () => {
        if (selectedIndex == null) return;
        setLoadingEmployeeList(true);

        // For the startTime
        // Converts hours selected to seconds
        // TODO: handle null values
        let hours = availableHours[selectedIndex.row].time.asHours();
        const startTime = moment(date).startOf('day').add(hours, 'h').unix();
        setSelectedTime(startTime);
        // For the services

        let servicesFactor = 1;
        var servicesRefs = [];
        let primes = [];
        let endTime = startTime;
        for (var service in services) {
            let ref = services[service].service.ref;
            servicesRefs[service] = ref;

            for (let index in props.serviceTypes) {
                let serviceData = props.serviceTypes[index];

                if (
                    serviceData.ref === ref &&
                    !primes.includes(serviceData.prime)
                ) {
                    servicesFactor = servicesFactor * serviceData.prime;
                    primes.push(serviceData.prime);

                    endTime += serviceData.durationMin * 60;
                }
            }
        }

        // Call firebase function
        functions()
            .httpsCallable('getWashersByService')({
                startTime: startTime,
                endTime,
                servicesFactor,
            })
            .then((res) => {
                let washers = res.data.message.map((washer) => {
                    return {
                        ref: washer.ref,
                        firstName: washer.firstName ?? 'Lavador',
                        lastName: washer.lastName ?? '',
                        displayName:
                            washer.displayName ?? washer.firstName ?? 'Lavador',
                        rating: washer.avgRating ?? 0,
                        services: washer.services ?? [],
                        profilePicture: washer.profilePicture,
                    };
                });

                fillProfilePicutreUris(washers)
                    .then((res) => {
                        addEmployees(res);
                        setEmployeeList(res);
                        setLoadingEmployeeList(false);
                    })
                    .catch((err) => {
                        setLoadingEmployeeList(false);
                        console.warn(err);
                    });
            })
            .catch((err) => {
                console.warn('ERR', err);
            });
    };

    if (!props.render)
        return (
            <View
                style={{
                    width: '100%',
                    flex: 1,
                }}
            ></View>
        );

    return (
        <View
            style={{
                width: '100%',
                flex: 1,
            }}
        >
            <View
                style={{ flex: 1, width: '100%' }}
                onLayout={(event) => {
                    setHeight(event.nativeEvent.layout.height);
                }}
            >
                <Pressable onPress={() => setActiveSection(0)}>
                    <View style={styles.collapsedHeader}>
                        <Text category="s1" style={{ fontWeight: 'bold' }}>
                            Selecciona un horario
                        </Text>
                    </View>
                </Pressable>
                <Collapsible
                    collapsed={activeSection !== 0}
                    style={[
                        styles.collabsible,
                        styles.centered,
                        { paddingHorizontal: 20 },
                    ]}
                >
                    <ScrollView
                        style={{
                            height: height - 100,
                            width: '100%',
                        }}
                        contentContainerStyle={{
                            alignContent: 'center',
                            paddingVertical: 20,
                            flex: 1,
                        }}
                    >
                        <Card header={Header}>
                            <DatePicker
                                fadeToColor={theme['background-basic-color-1']}
                                textColor={theme['text-basic-color']}
                                locale="es"
                                minimumDate={today}
                                maximumDate={weekLapse}
                                mode="date"
                                date={date}
                                onDateChange={(nextDate) => {
                                    setDate(nextDate);
                                }}
                            />
                        </Card>
                        <View style={{ paddingVertical: 20 }}>
                            <Label>HORA DE SERVICIO</Label>
                            <Select
                                style={{
                                    backgroundColor:
                                        theme['background-basic-color-1'],
                                }}
                                selectedIndex={selectedIndex}
                                value={
                                    selectedIndex
                                        ? availableHours[selectedIndex.row]
                                              .label
                                        : null
                                }
                                onSelect={(index) => {
                                    setSelectedIndex(index);

                                    // REMOVE
                                    let hours =
                                        availableHours[
                                            index.row
                                        ].time.asHours();
                                    const startTime = moment(date)
                                        .startOf('day')
                                        .add(hours, 'hours')
                                        .set('m', 0)
                                        .unix();

                                    setRequestData({
                                        date: startTime,
                                        employee: null,
                                    });
                                }}
                            >
                                {availableHours.map((hour, idx) => (
                                    <SelectItem
                                        disabled={
                                            moment(date).dayOfYear() ==
                                                moment().dayOfYear() &&
                                            moment().hours() + 1 >
                                                hour.time.hours()
                                        }
                                        key={idx}
                                        title={hour.label}
                                    />
                                ))}
                            </Select>
                        </View>
                        <Label
                            style={{
                                alignSelf: 'flex-end',
                                position: 'absolute',
                                bottom: 0,
                                margin: 10,
                            }}
                        >
                            {' '}
                            Duración estimada: {duration} min
                        </Label>
                    </ScrollView>
                </Collapsible>
                <Pressable
                    onPress={() => {
                        if (selectedIndex) {
                            setActiveSection(1);
                            loadEmployees();
                        }
                    }}
                >
                    <View style={styles.collapsedHeader}>
                        <Text category="s1" style={{ fontWeight: 'bold' }}>
                            Selecciona un empleado
                        </Text>
                    </View>
                </Pressable>
                <Collapsible
                    style={styles.collabsible}
                    collapsed={activeSection !== 1}
                >
                    <ScrollView
                        style={{ height: height - 100 }}
                        contentContainerStyle={{
                            paddingVertical: 20,
                            paddingHorizontal: 10,
                        }}
                    >
                        {loadingEmployeeList ? (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Spinner />
                            </View>
                        ) : employeeList.length === 0 ? (
                            // TODO: Hacer que no sea clickable el boton de continuar si no hay lavadores seleccionados / disponibles
                            <Text style={{ textAlign: 'center' }}>
                                Los lavadores están ocupados, por favor prueba
                                seleccionando otro horario.
                            </Text>
                        ) : (
                            employeeList.map((employee, idx) => (
                                <Lavador
                                    key={idx}
                                    data={employee}
                                    onPress={() => {
                                        setSelectedWasher(idx);
                                        setRequestData({
                                            date: selectedTime,
                                            employee: employeeList[idx],
                                        });
                                    }}
                                    selected={selectedWasher === idx}
                                    style={{ paddingBottom: 10 }}
                                />
                            ))
                        )}
                    </ScrollView>
                </Collapsible>
            </View>
        </View>
    );
}

const themedStyles = StyleService.create({
    collapsedHeader: {
        paddingHorizontal: 20,
        height: 50,
        justifyContent: 'center',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'border-basic-color-3',
    },
    collabsible: {
        width: '100%',
        backgroundColor: 'background-basic-color-1',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        borderBottomColor: 'border-basic-color-3',
    },
    centered: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});

const mapStateToProps = (state) => {
    const {
        vehicles,
        services,
        serviceTypes,
        vehicleTypes,
        employees,
        requestData,
    } = state;
    return {
        vehicles,
        services: services.filter((s) => s.active),
        serviceTypes,
        vehicleTypes,
        employees,
        requestData,
    };
};

export default connect(mapStateToProps, {
    populateEmployee,
    addEmployees,
    setRequestData,
})(ScheduleSelection);
