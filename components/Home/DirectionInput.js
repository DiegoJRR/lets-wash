import React, { Component } from "react";
import {
  View,
  Easing,
  Animated,
  Dimensions,
  BackHandler,
  Pressable,
  PermissionsAndroid,
} from "react-native";
import {
  Text,
  Card,
  Icon,
  useTheme,
  withStyles,
  Spinner,
} from "@ui-kitten/components";
import { Foundation, FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Geolocation from "react-native-geolocation-service";
import {
  selectAddress,
} from "../../redux/actions";

// TODO: Agregar permiso de ubicación para habilitar botón de ubicación actual

const window = Dimensions.get("window");

const Header = (props) => {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      disabled={props.loading}
      style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: "row",
      }}
    >
      <Foundation
        name="target-two"
        size={24}
        color={theme["text-basic-color"]}
        style={{ marginRight: 10 }}
      />
      <Text>Usar mi ubicacion actual</Text>
      {props.loading ? (
        <View
          style={{
            flexGrow: 1,
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Spinner />
        </View>
      ) : null}
    </Pressable>
  );
};

class DirectionInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      addressCardHeight: 0,
      opened: false,
      hasLocationPermission: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.requestLocationPermission();
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        // {
        //     title: 'Cool Photo App Camera Permission',
        //     message:
        //         'Cool Photo App needs access to your camera ' +
        //         'so you can take awesome pictures.',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ hasLocationPermission: true });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  selectCurrentAddress = () => {
    this.setState({
      loading: true,
    });
    Geolocation.getCurrentPosition(
      (position) => {
        this.props.selectAddress({
          main_text: "Ubicación actual",
          secondary_text: "",
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
        this.close(this.props.onClose);

        this.setState({
          loading: false,
        });
      },
      (error) => {
        console.warn(error.code, error.message);
        this.close(this.props.onClose);
        this.setState({
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    // this.props.selectAddress({
    //     main_text: '',
    //     secondary_text: '',
    //     location: {
    //         lat: 1,
    //         lng: 2,
    //     },
    // });
  };

  backAction = () => {
    this.close(this.props.onClose);
    return true;
  };

  open = () => {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.setState({ opened: true });
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => this.setState({ opened: true }));
  };

  close = (cb) => {
    this.backHandler.remove();
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      this.setState({ opened: false });
      cb();
    });
  };

  render() {
    const styles = this.props.eva.style;

    return (
      <View style={[this.props.style, { flexDirection: "column", flex: 1 }]}>
        <Card
          style={[styles.addressInputCard]}
          onPress={() => {
            this.props.onPress();
          }}
        >
          <View style={{ justifyContent: "space-around" }}>
            <View style={styles.inputLabelContainer}>
              <Animated.View
                style={{
                  width: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 34],
                  }),
                  overflow: "hidden",
                }}
              >
                <Icon
                  onPress={() => {
                    this.close(this.props.onClose);
                  }}
                  name="arrow-back"
                  fill={styles.icon.color}
                  style={styles.icon}
                />
              </Animated.View>
              <Pressable
                disabled={!this.state.opened || this.state.loading}
                style={{
                  flex: 1,
                  height: "100%",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.close(this.props.onClose);
                  this.props.navigation.navigate("AutoComplete");
                }}
              >
                <Text
                  style={{ fontWeight: "bold" }}
                  appearance={
                    this.props.selectedAddress && !this.state.loading
                      ? "default"
                      : "hint"
                  }
                >
                  {this.props.selectedAddress
                    ? this.props.selectedAddress.main_text
                    : "Selecciona una dirección"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Card>
        <Animated.View
          style={{
            opacity: 1,
            marginTop: this.state.fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [(-window.height * 5) / 8 - 80, 0],
            }),
          }}
        >
          <Card
            disabled={!this.state.hasLocationPermission}
            header={() => (
              <Header
                loading={this.state.loading}
                onPress={this.selectCurrentAddress}
              />
            )}
            style={styles.addressListCard}
          >
            <ScrollView
              style={{
                marginTop: -16,
                width: "100%",
                height: "100%",
              }}
              contentContainerStyle={{
                width: "100%",
              }}
            >
              {this.props.userAddresses.map((address, idx) => (
                <Pressable
                  disabled={this.state.loading}
                  key={idx}
                  style={styles.cachedAddressContainer}
                  onPress={() => {
                    this.props.selectAddress(address);
                    this.close(this.props.onClose);
                  }}
                >
                  <Icon
                    name="pin"
                    style={styles.icon}
                    fill={styles.icon.color}
                  />
                  <View style={{ flex: 1 }}>
                    <Text category="p1">{address.main_text}</Text>
                    <Text category="label" appearance="hint">
                      {address.secondary_text}
                    </Text>
                  </View>
                </Pressable>
              ))}
              {this.props.cachedAddresses.map((address, idx) => (
                <Pressable
                  disabled={this.state.loading}
                  key={idx}
                  style={styles.cachedAddressContainer}
                  onPress={() => {
                    this.props.selectAddress(address);
                    this.close(this.props.onClose);
                  }}
                >
                  <FontAwesome
                    name="history"
                    size={24} // TODO: cambiar a constante
                    style={styles.icon}
                    color={styles.icon.color}
                  />
                  <View style={{ flex: 1 }}>
                    <Text category="p1">{address.main_text}</Text>
                    <Text category="label" appearance="hint">
                      {address.secondary_text}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Card>
        </Animated.View>
      </View>
    );
  }
}

const StyledAddressInput = withStyles(DirectionInput, (theme) => ({
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    color: theme["text-basic-color"],
  },
  addressInputCard: {
    height: 50,
    backgroundColor: theme["background-basic-color-1"],
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 30,
    zIndex: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: "hidden",
    flexDirection: "column",
  },
  inputLabelContainer: {
    margin: -16,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  addressListCard: {
    borderRadius: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 25,
    zIndex: 25,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    height: (window.height * 5) / 8,
  },
  cachedAddressContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomColor: theme["color-basic-400"],
    borderBottomWidth: 1,
    alignItems: "center",
  },
}));

const mapStateToProps = (state) => {
  const { selectedAddress, userAddresses, cachedAddresses } = state;
  return { selectedAddress, userAddresses, cachedAddresses };
};

export default connect(mapStateToProps, { selectAddress }, null, {
  forwardRef: true,
})(StyledAddressInput);
