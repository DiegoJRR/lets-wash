import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon, Text, withStyles } from '@ui-kitten/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';
import {
    addCachedAddress,
    addAddress,
    selectAddress,
} from '../../redux/actions';

class AddressAutocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSyle: props.eva.style.blurredInput,
        };
    }

    render() {
        const { navigation } = this.props;
        const styles = this.props.eva.style;
        return (
            <View style={styles.container}>
                <GooglePlacesAutocomplete
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    placeholder="Search"
                    onPress={(data, details) => {
                        // 'details' is provided when fetchDetails = true
                        // this.props.selectedAddress(details);
                        this.props.selectAddress({
                            main_text: data.structured_formatting.main_text,
                            secondary_text:
                                data.structured_formatting.secondary_text,
                            location: details.geometry.location,
                        });
                        this.props.addCachedAddress({
                            main_text: data.structured_formatting.main_text,
                            secondary_text:
                                data.structured_formatting.secondary_text,
                            location: details.geometry.location,
                        });
                        navigation.navigate('Home', {
                            showingRequest: false,
                        });
                    }}
                    onFail={(error) => console.error(error)}
                    query={{
                        key: 'AIzaSyDJPgVOJpvE88T6SrZAGOro3MuKxuwNrqs',
                        language: 'es',
                        components: 'country:mx',
                    }}
                    textInputProps={{
                        onBlur: () => {
                            this.setState({
                                inputSyle: styles.blurredInput,
                            });
                        },
                        onFocus: () => {
                            this.setState({
                                inputSyle: styles.focusedInput,
                            });
                        },
                        placeholder: '¿A dónde vamos?',
                        placeholderTextColor: styles.placeholder.color,
                    }}
                    renderRow={(rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address =
                            rowData.structured_formatting.secondary_text;
                        return (
                            <View>
                                <Text category="p1">{title}</Text>
                                <Text category="label" appearance="hint">
                                    {address}
                                </Text>
                            </View>
                        );
                    }}
                    listEmptyComponent={() => (
                        <View style={styles.empyList}>
                            <Text appearance="hint">
                                No hay resultados para su búsqueda
                            </Text>
                        </View>
                    )}
                    renderLeftButton={() => (
                        <Icon
                            onPress={() => {
                                navigation.goBack();
                            }}
                            name="arrow-back"
                            style={styles.backIcon}
                            fill={styles.backIcon.fill}
                        />
                    )}
                    styles={{
                        ...styles.GooglePlacesAutocompleteStyles,
                        textInput: {
                            height: 50,
                            marginRight: 20,
                            borderBottomWidth: 1,
                            ...this.state.inputSyle,
                        },
                    }}
                />
            </View>
        );
    }
}

const StyledAddressAutocomplete = withStyles(AddressAutocomplete, (theme) => ({
    placeholder: {
        color: theme['text-hint-color'],
    },
    backIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 10,
        fill: theme['text-basic-color'],
    },
    blurredInput: {
        color: theme['text-basic-color'],
        backgroundColor: theme['background-basic-color-1'],
        borderBottomColor: theme['border-alternative-color-1'],
    },
    focusedInput: {
        color: theme['text-basic-color'],
        backgroundColor: theme['background-basic-color-1'],
        borderBottomColor: theme['border-alternative-color-1'],
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme['background-basic-color-1'],
    },
    empyList: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 50,
    },
    GooglePlacesAutocompleteStyles: {
        container: {
            flex: 1,
            width: '100%',
        },
        textInputContainer: {
            height: 70,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: theme['background-basic-color-1'],
            borderBottomColor: theme['border-alternative-color-1'],
            color: theme['text-basic-color'],
        },
        loader: {
            backgroundColor: 'red',
        },
        row: {
            padding: 15,
            flexWrap: 'wrap',
            flexShrink: 1,
            overflow: 'scroll',
            width: '100%',
            backgroundColor: theme['background-basic-color-1'],
        },
        description: {
            flexWrap: 'wrap',
        },
        listView: {
            flex: 1,
            width: '100%',
        },
    },
}));

const mapStateToProps = (state) => {
    const { cachedAddresses, selectedAddress, userAddresses } = state;
    return { cachedAddresses, selectedAddress, userAddresses };
};

export default connect(mapStateToProps, {
    addCachedAddress,
    addAddress,
    selectAddress,
})(StyledAddressAutocomplete);
